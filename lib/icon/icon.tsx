import styled from "styled-components";
import { useState } from "react";
const StyledIcon = styled.div<{ url?: string, name: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ name }) => `hsl(${stringToHue(name)}deg, 70%, 70%)`};
  background-image: ${({ url }) => url ? `url(${url})` : 'none'};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.5em;
  color: white;
`
const stringToHue = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return ((hash % 360) + 360) % 360;
}
export const Icon = ({ url, name }: { url?: string, name: string }) => {
    const [initials] = useState(name?.split(' ').map((n: string) => n.charAt(0).toUpperCase()).join(''))
    return (
        <StyledIcon url={url} name={name}>
            {url ? '' : initials}
        </StyledIcon>
    )
}
