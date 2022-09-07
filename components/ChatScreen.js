import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import { auth ,db } from "../firebase";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import { useState } from "react";
import firebase from "firebase";
import getRecipientId from "../utils/getRecipientId";
import TimeAgo from "timeago-react";
import { useRef } from "react";



function ChatScreen({chat, messages}) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const endOfMessagesRef = useRef(null);
    const [input, setInput] = useState("");
    const [messagesSnapshot] = useCollection(
        db
        .collection('chats')
        .doc(router.query.id)
        .collection("messages")
        .orderBy('timestamp', 'asc'));


    const [recipientSnapshot] = useCollection(
        db
            .collection('users')
            .where("email", "==", getRecipientId(chat.users, user))
    )

    const showMessages = () => {
        
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => 
               <Message
                key={message.id}
                user = {message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }
            }
                />
            

            )
    }else{
        return (
         JSON.parse(messages).map((message) => {
             <Message key={message.id} user={message.user} message={message}/> 
        }))
    }
    }
    
        const scrollToBottom=()=>{
            endOfMessagesRef.current.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start",
                });
        }

        const sendMessage = (e) => {
            e.preventDefault();

            //update Last seen..
            db.collection("users").doc(user.uid).set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            },
            {merge: true});

            db.collection('chats').doc(router.query.id).collection('messages').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                messages:input,
                user: user.email,
                photoURL: user.photoURL,
            });

            setInput("");
            scrollToBottom();
        };

    

const recipient = recipientSnapshot?.docs?.[0]?.data();
const recipientId = getRecipientId(chat.users,user);

    return (
        <Container>
            <Header>
             {recipient ? (   <Avatar src={recipient?.photoURL}/>
             ): (<Avatar>{recipientId[0]}</Avatar>)}

                <HeaderInformation>
                    <h3>{recipientId} </h3>
                    {recipientSnapshot ? ( 
                        <p>Last active: {' '}
                        {recipient?.lastSeen.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ): (
                            "Unavailable"
                            )}  </p>
                    ):(
                        <p>Loading last active....</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>
            </MessageContainer>

            <InputContainer>
                <InsertEmotionIcon  />
                
                <Input value={input} onChange={e => setInput(e.target.value)}/>
                <button hidden disabled = {!input} type="submit" onClick={sendMessage}>Send Message</button>
                
                <MicIcon/>
            </InputContainer>
        </Container>
    )
    };


export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
flex: 1;
outline: 0;
border: none;
border-radius: 10px;
background-color: whitesmoke;
padding: 20px;
color:green;
margin-left: 15px;

`;

const InputContainer = styled.form`
display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom:0px;
background-color: white;
z-index: 100;
`;


const Header = styled.div`
position: sticky;
background-color: white;
z-index: 100;
top: 0;
display: flex;
padding: 11px;
height: 80px;
align-items: center;
border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
margin-left: 15px;
flex: 1;

>h3 {
    margin-bottom: 3px;
}

>p{
    font-size:14px;
    color: gray;
}
`;

const HeaderIcons = styled.div``;

const IconButton = styled.div``;

const MessageContainer = styled.div`
padding: 20px;



background-color: lightgray;
min-height: 90vh;
`;

const EndOfMessage = styled.div`
margin-bottom: 110px; 
`;

