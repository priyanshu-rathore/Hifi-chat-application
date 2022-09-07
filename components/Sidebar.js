import { Avatar, IconButton } from '@material-ui/core'

import ChatIcon from '@material-ui/icons/Chat'
import { Button } from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import SearchIcon from '@material-ui/icons/Search'
import styled from 'styled-components'
import * as EmailValidator from 'email-validator'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import {useCollection} from "react-firebase-hooks/firestore"
import Chat from './Chat'
import MainPage from './MainPage'

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatsSnapshot] = useCollection(userChatRef);
    
    const createChat=()=>{
        const input = prompt("please enter an email address for the user you wish to chat with")

    if (!input) return null; 

    if(
        EmailValidator.validate(input) &&
        !chatAlreadyExists(input) &&
        input !== user.email
    )

    {
    // we need to add chat into te DB 'chat' collection 
    db.collection('chats').add({
        users:[user.email , input],
    })

}

}
const chatAlreadyExists = (recipientEmail) => 
    !!chatsSnapshot?.docs.find(
        (chat) => chat.data().users.find(
            (user) => user === recipientEmail)?.length > 0);


    return (
        <Container>
            <Side>
            <Header>
                <UserAvatar src={user.photoURL} onClick={()=> auth.signOut()}/>
                <IconContainer>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
                </IconContainer>
            </Header>

            <Search>
                <SearchIcon/>
                <SearchInput placeholder=" Search in Chat"/>
            </Search>

            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
            
            {/* Lists of Chats*/}
            {chatsSnapshot?.docs.map((chat) => <Chat key={chat.id} id={chat.id} users={chat.data().users}/>)}
            </Side>
            <Main>
                <MainPage/>
            </Main>          
        </Container>
    );
}

export default Sidebar

const Container = styled.div`
display: flex;
border-right: 1px solid whitesmoke;
height: 100vh;



`;

const Side = styled.div`
flex: 0.45;
min-width: 300px;
max-width: 350px;
overflow-y:scroll;
::-webkit-scrollbar{
display: none;
}

-ms-overflow-style:none;
scrollbar-width: none;
`;

const Main = styled.div`
flex: 8;
background-color: lightgray;

`;


const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    `;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
    `;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }

`;

const SidebarButton = styled(Button)`
width:100%
`;

const Header = styled.div`
 display: flex;
 position: sticky;
 top: 0;
 background-color: white;
 justify-content: space-between;
 z-index: 1;
 align-items: center;
 padding: 15px;
 height: 80px;
 border-bottom:1px solid whitesmoke;
`;



const IconContainer = styled.div`


 `;



