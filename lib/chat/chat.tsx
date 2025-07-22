import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState, WheelEventHandler } from "react";
import styled from "styled-components";
import { Input } from "../input/input";
import { Message, MessageProps } from "../message/message";
const StyledChat = styled.div`
    width: 100%;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  border: 1px solid #eee;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
  }
  &::-webkit-scrollbar-track {
    background-color: #ddd;
  }
`
const StyledHeader = styled.div<{ styles: Partial<Styles> }>`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: ${({ styles }) => styles.headerColor ?? '#eee'};
  color: ${({ styles }) => styles.headerTextColor ?? '#666'};
  font-weight: ${({ styles }) => styles.headerFontWeight ?? 'normal'};
  cursor: pointer;
`
const StyledHeaderTitle = styled.div`

`
interface Props {
    onHeaderClick: () => void
    setNotificationCount: Dispatch<SetStateAction<number>>
    title: string
    user: string
    iconSource: 'pixel' | 'initials'
    translation?: Translation
    styles?: Partial<Styles>
    pulldown?: JSX.Element
    connectionParams: Partial<ConnectionParams>;
    open?: boolean
}
export interface Translation {
    send: string
    placeholder: string
}
export interface Styles {
    headerColor: string;
    headerTextColor: string;
    headerFontWeight: 'bold' | 'normal';
    messageBackgroundColor: string;
    messageTextColor: string;
    ownMessageBackgroundColor: string;
    ownMessageTextColor: string;
    inputBackgroundColor: string;
    inputTextColor: string;
    sendButtonBackgroundColor: string;
    sendButtonTextColor: string;
}
export interface ConnectionParams {
    room: string
    protocol: string
    // example: ntfy.sh
    server: string
    pollrate: number
    since: string
}
export const Chat = ({ title, user, open, onHeaderClick, setNotificationCount, iconSource, translation, styles, pulldown, connectionParams: { protocol = 'https://', server = 'ntfy.sh', pollrate = 1, room = 'ntfydemochatroom153', since = '10m' } }: Props) => {
    const [messages, setMessages] = useState<MessageProps[]>([])
    const [isScrolled, setIsScrolled] = useState(false)
    const chat = useRef<HTMLDivElement>(null)
    const addMessage = useCallback((message: MessageProps) => {
        setMessages((messages) => {
            return [...messages, message]
        })
    }, [setMessages])
    useEffect(() => {
        const ROOM = room || "ntfydemochatroom";
        const SERVICE = `${protocol}${server}/${ROOM}/sse`;
        const eventSource = new EventSource(SERVICE)
        eventSource.onmessage = (e) => {
            if (e.data === "") {
                return;
            }
            const data = JSON.parse(JSON.parse(e.data).message);
            const username = data.user === user ? "me" : data.user
            const encodedUser = encodeURIComponent(username)
            const message = {
                side: data.user === user ? "right" : "left",
                picture: iconSource === 'pixel' ? `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodedUser}` : '',
                name: username,
                fullName: data.user,
                time: data.time || Date.now(),
                message: data.message
            }
            addMessage(message)

            if (data.user !== user) {
                setNotificationCount((count) => count + 1)
                if (isScrolled) {
                    setNotificationCount((count) => count + 1)
                }
                if (chat !== null && chat.current !== null) {
                    if (Math.abs(chat.current.scrollHeight - (chat.current.scrollTop + chat.current.clientHeight)) < 50) {
                        setIsScrolled(false)
                    } else {
                        setIsScrolled(true)
                    }
                }
            }
        }

        return () => {
            eventSource.close()
        }
    }, [room, user, addMessage, iconSource, server, setMessages, protocol, setNotificationCount, chat])

    // used to generate fake messages(does not trigger events that happen on recieving a message, so only use for checking how something looks with full chat)
    // useEffect(() => {
    //     const tm = setInterval(() => {
    //         addMessage({
    //             side: "left",
    //             picture: ``,
    //             name: "test",
    //             fullName: "test",
    //             time: 0,
    //             message: `test ${Date.now()}`,
    //             type: "test"
    //         })
    //     }, 1000);


    //     return () => {
    //         clearInterval(tm)
    //     }
    // }, [addMessage])
    useEffect(() => {
        if (open) {
            setNotificationCount(0)
            if (chat !== null && chat.current !== null) {
                chat.current.scrollTop = chat.current.scrollHeight
            }
        }
    }, [open, setNotificationCount])
    useEffect(() => {
        if (chat !== null && chat.current !== null && messages.length > 1 && messages[messages.length - 1].fullName === user) {
            chat.current.scrollTop = chat.current.scrollHeight + 1500;
            setIsScrolled(false)
        }
    }, [messages, chat, user])
    useEffect(() => {
        async function getMessages() {
            const SERVICE = `${protocol}${server}/${room}/json?since=${since}&poll=${pollrate}`;
            const response = await fetch(SERVICE)
            if (response.status === 502) {
                getMessages()
                return;
            } else if (response.status !== 200) {
                console.error(response.statusText)
                return;
            } else {
                const data = await response.text()
                const message = data.split(/\r?\n/)
                const messages = message.map((message) => {
                    try {
                        const data = JSON.parse(JSON.parse(message).message);
                        const username = data.user === user ? "me" : data.user
                        const encodedUser = encodeURIComponent(username)
                        return {
                            side: data.user === user ? "right" : "left",
                            picture: iconSource === 'pixel' ? `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodedUser}` : '',
                            name: username,
                            fullName: data.user,
                            time: data.time || Date.now(),
                            message: data.message
                        }
                    } catch (error) {
                        console.error(error)
                        return {
                            side: "",
                            picture: ``,
                            name: "",
                            fullName: "",
                            time: 0,
                            message: ""
                        }
                    }

                })
                setMessages(messages.filter((message) => message.side !== ""))
            }
        }
        getMessages()
    }, [room, user, setMessages, iconSource, server, since, pollrate, protocol])
    const sendMessage = useCallback((value: string) => {
        if (!value) {
            return;
        }
        const SERVICE = `${protocol}${server}/${room}`
        fetch(SERVICE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: value,
                user: user,
                time: Date.now()
            })
        })
    }, [server, user, room, protocol])
    const onScroll: WheelEventHandler = (event) => {
        if (event.target !== null && chat.current !== null) {
            const target = chat.current
            console.log(event.deltaY)
            const positionCheckIfScrolled = (target.scrollHeight - (target.scrollTop + target.clientHeight + event.deltaY) < 50 && event.deltaY > 0 && isScrolled)
            const positionCheck = (target.scrollHeight - (target.scrollTop + target.clientHeight + event.deltaY) < 50 && event.deltaY > 0 && !isScrolled)
            if (positionCheckIfScrolled || positionCheck) {
                setIsScrolled(false)
            } else {
                setIsScrolled(true)
            }
        }
    }
    return (
        <>
            <StyledHeader styles={styles ?? {}} onClick={onHeaderClick}>
                <StyledHeaderTitle>{title}</StyledHeaderTitle>
                {pulldown}
            </StyledHeader>
            <StyledChat ref={chat} onWheel={onScroll} >
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        side={message.side}
                        picture={message.picture}
                        name={message.name}
                        fullName={message.fullName}
                        time={message.time}
                        message={message.message}
                    // isAFollowUp={messages[index - 1]?.fullName === message.fullName}
                    />
                ))}
            </StyledChat>
            {isScrolled &&
                <button
                    style={{
                        position: 'absolute',
                        right: '30px',
                        bottom: '100px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        background: 'transparent',
                        alignItems: 'center',
                        border: '1px solid #ccc'
                    }}
                    onClick={() => { chat.current?.scrollTo({ top: chat.current.scrollHeight, behavior: 'smooth' }); setIsScrolled(false) }}
                >
                    <svg
                        style={{
                            flex: '0 0 30px',
                            width: '30px',
                            fill: styles?.headerColor ?? 'white'
                        }}
                        viewBox="0 0 25 25"
                    >
                        <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" />
                    </svg>
                </button>
            }
            <Input styles={styles} translation={translation} onSubmit={(value) => sendMessage(value)}></Input>
        </>
    );
}