import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { auth } from '../firebase';
import moment from "moment";

function Message({user, message}) {
    const [userloggedIn] =useAuthState(auth)

    const TypeOfMessage = user ===userloggedIn.email? Sender : Reciever;
    return (
        <Container>
            <TypeOfMessage>
                
                {message.messages}
            <Timestamp>
            {message.timestamp? moment(message.timestamp).format('LT') : '...'}
            </Timestamp> 
            
            </TypeOfMessage>
            
        </Container>
    )
}

export default Message

const Container = styled.div``;

const MessageElement = styled.p`
width: fit-content;
padding: 15px;
border-radius: 8px;
margin:10px;
min-width: 60px;
padding-bottom: 26px;
position: relative;
text-align: right;
`;

const Timestamp = styled.p`
font-size: 10px;
color: grey;
font-size: 9px;
position: absolute;
bottom: 0;
text-align: right;
right: 0.5;
`;

const Sender = styled(MessageElement)`
background-color: #dcf8c6;
margin-left: auto;
`;

const Reciever = styled(MessageElement)`
background-color: whitesmoke;
text-align: left;
`;