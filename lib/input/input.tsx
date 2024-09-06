import { useState } from "react"
import styled from "styled-components"
import { Styles, Translation } from "../chat/chat"
const StyledForm = styled.form`

    display: flex;
    padding: 10px;
    border-top: 2px solid #ddd;
    background: #eee;
    & * {
        
        padding: 10px;
        border: none;
        border-radius: 3px;
        font-size: 1em;
    }
`
const StyledInput = styled.input`
    flex: 1;
    background: #ddd;
    color: #000;
`
const StyledButton = styled.button<{ styles: Partial<Styles> }>`

    margin-left: 10px;
    background: ${({styles}) => styles.sendButtonBackgroundColor ?? 'rgb(0, 196, 65)'};
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.23s;
  `
interface Props {
    onSubmit: (value: string) => void
    translation?: Translation
    styles?: Partial<Styles>;
}
export const Input = ({ onSubmit, translation, styles }: Props) => {
    const [value, setValue] = useState("")
    console.log(styles)
    return (
        <StyledForm onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); onSubmit(value); setValue("") }}>
            <StyledInput type="text" placeholder={translation?.placeholder ? translation?.placeholder : "Enter your message..."} value={value} onChange={(e) => setValue(e.target.value)} />
            <StyledButton styles={styles ?? {}} type="submit" >{translation?.send ? translation?.send : "Send"}</StyledButton>
        </StyledForm>
    )
}