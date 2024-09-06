import styled from "styled-components";
import { Icon } from "../icon/icon";
const StyledMessage = styled.div<{ side: string }>`
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  flex-direction: ${({ side }) => side === "left" ? "row" : "row-reverse"};
  margin: 0;
  margin-left: ${({ side }) => side === "left" ? "10px" : "0"};
  margin-right: ${({ side }) => side === "left" ? "0" : "10px"};
`
const StyledMessageBubble = styled.div<{ side: string }>`
    max-width: 405px;
    padding: 15px;
    border-radius: ${({ side }) => side === "left" ? "15px 15px 15px 0" : "15px 15px 0 15px"};
    background-color: ${({ side }) => side === "left" ? "#ececec" : "#579ffb"};
    color: ${({ side }) => side === "left" ? "black" : "white"};
`

const StyledMessageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`
const StyledMessageName = styled.div`
  font-weight: bold;
  margin-right: 10px;
`
const StyledMessageTime = styled.div`
    font-size: 0.85em;
`
const StyledMessageText = styled.div`

`
function formatDate(date: Date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
  
    return `${h.slice(-2)}:${m.slice(-2)}`;
  }
  export interface MessageProps {
    side: string,
    picture: string,
    name: string,
    fullName: string,
    time: number,
    message: string
    isAFollowUp?: boolean
  }
export const Message = ({ side, picture, name, fullName, time, message, isAFollowUp }: MessageProps) => {
    return (
        <StyledMessage side={side}>
            {!isAFollowUp && <Icon url={picture} name={fullName}></Icon>}
            <StyledMessageBubble side={side}>
                <StyledMessageInfo>
                    {!isAFollowUp && <StyledMessageName>{name}</StyledMessageName>}
                    <StyledMessageTime>{formatDate(new Date(time))}</StyledMessageTime>
                </StyledMessageInfo>
                <StyledMessageText>{message}</StyledMessageText>
            </StyledMessageBubble>
        </StyledMessage>
    );
}