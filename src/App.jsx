import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Image, Card, Container, Spinner, Stack, Row, Col} from 'react-bootstrap';
import './style.css'
import gitLogo from './assets/git_logo.png';
import lupa from './assets/lupa.svg';

const base_url = "https://api.github.com/users/"


function App() {
  const [user, setUser] = useState("")
  const [userSearch, setUserSearch] = useState(null)
  const [searching, setSearching] = useState(false)

  function handleSearch() {
    if(user.trim()){
      setSearching(true)
      setUserSearch(user)
    }
  }
  
  return (
    <>
    <Container id='black-container' className='bg-black d-flex flex-column vh-100'>
      <Row lg={10} md={8} className="d-flex justify-self-start align-items-center mt-5 w-100">
        <Stack direction="horizontal" gap={2} className="justify-content-center align-items-center text-center">
          <Image src={gitLogo} className="img-fluid" style={{ maxHeight: "58px" }} />
          <p className="text-white h1">Perfil</p>
          <p className='h1' id='githubname'>GitHub</p>
        </Stack>
      </Row>
      <Row lg={10} md={8} className='justify-content-center mt-4'>
      <div className="input-group mb-3 mt-2" id='search-bar'>
            <input type="text" value={user}  onChange={e => setUser(e.target.value)} className="form-control" placeholder="Digite um usuário do Github" aria-label="username" aria-describedby="button-addon2" 
            style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }} />
            <button onClick={handleSearch} className="btn" type="button" id="button-addon2" 
            style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
              <Image src={lupa} />
            </button>
        </div>  
      </Row>
      {searching && <UserCard user={userSearch} key={userSearch} />}
    </Container>
    </>
  )
}

function UserCard({user}) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUserData() {
      try{
        setLoading(true)

        const response = await fetch(`${base_url}${user}`)
        
        if (!response.ok) {
          throw new Error('Erro 404')
        }
        
        const data = await response.json()

        setUserData(data)
        setError(null)
      }
      catch(error){ 
        setError(error)
        setUserData(null);
        
      } finally{
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])
  
  if (loading) {
    return (
      <Container className='mt-4 centered-container'> 
      <Spinner animation="border" />
    </Container>  

  )}
  
  
  if (error || userData === null) {return (
    <Container className='centered-container error-container'> 
    <Card style={{ width: '44rem', height: '5rem', backgroundColor: '#D9D9D9', borderRadius: '10px' }}>
    <Card.Body>
      <p className='errorMessage'>Nenhum perfil foi encontrado com esse nome de usuário.</p>
      <p className='errorMessage'>Tente novamente</p>      
    </Card.Body>
  </Card>
  </Container> 

  )}


  return (<>
  <Container className='centered-container mb-3'> 
    <Card id='usercard' style={{ width: '51rem', height: '16rem', borderRadius: '25px' }}>
      <Card.Body>
        <Row className="h-100 d-flex align-items-center gap-lg-5 gap-md-3 gap-sm-2">
          <Col lg={3} md={4} sm={12}>
            <Image src={userData.avatar_url}
                  roundedCircle
                  id='usercard-img'
                  className='text-center'
          />
          </Col>
          <Col>
            <Stack direction="vertical" className="justify-content-center align-items-start text-card">
              <p className="text-primary fs-5" id='name-user'>{userData.name}</p>
              <p className="text-grey fs-6">{userData.bio}</p>
            </Stack>
          </Col>
        </Row>       
      </Card.Body>
    </Card>
  </Container>  
  </>
  )
}



export default App
