
import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components"
import { auth, db } from "../firebase";
import getRecipientId from "../utils/getRecipientId";
import {useRouter} from "next/router";

function Chat  ({id , users})  {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [recipientSnapshot] = useCollection(
        db.collection("users").where("email", "==", getRecipientId(users,user))
    );

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientId = getRecipientId(users, user);


    return (
        
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src ={recipient?.photoURL}/> ) : ( <UserAvatar>{recipientId[0]}</UserAvatar> 
                ) }
            
            
            <p>{recipientId}</p>
            
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }

`;

const UserAvatar = styled(Avatar)`
margin:5px;
margin-right: 15px;
`;
