import { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Image, Card, Container, Spinner, Stack, Row, Col, Modal, Button} from 'react-bootstrap';
import './style.css'
import gitLogo from './assets/git_logo.png';
import lupa from './assets/lupa.svg';

const base_url = "https://api.github.com/users/"

function App() {
  const [user, setUser] = useState("")
  const [userSearch, setUserSearch] = useState(null)
  const [searching, setSearching] = useState(false)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function handleSearch() {
    if(user.trim()){  //verifica se o campo de busca não está vazio
      setSearching(true)
      setUserSearch(user)
    }
    else{
      handleShow()  //se o campo estiver vazio, exibe um alerta
    }
  }
  
  return (
    <>
    {/* layout inicial do site */}
    <Container id='black-container' className='bg-black d-flex flex-column vh-100'>
      <Row lg={10} md={8} className="d-flex justify-self-start align-items-center mt-5 w-100">
        <Stack direction="horizontal" gap={2} className="justify-content-center align-items-center text-center">
          <Image src={gitLogo} className="img-fluid" style={{ maxHeight: "58px" }} />
            <p className="text-white h1">Perfil</p>
            <p className='h1' id='github-name'>GitHub</p>
        </Stack>
      </Row>
      
      <Row lg={10} md={8} className='justify-content-center mt-4'>  
        {/* barra de busca de usuário */}
        <div className="input-group mb-3 mt-2" id='search-bar'>
              <input type="text" value={user}  onChange={e => setUser(e.target.value)} 
              className="form-control" 
              placeholder="Digite um usuário do Github"
              id='input-search'  
              style={{ borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px" }} />
              <button onClick={handleSearch} className="btn" type="button" id="button-addon2" 
              style={{ borderTopRightRadius: "10px", borderBottomRightRadius: "10px" }}>
                <Image src={lupa} />
              </button>
          </div>  
      </Row>

      {/* componente do card de usuário, que aparece após uma busca bem sucedida */}
      {searching && <UserCard user={userSearch} key={userSearch} />}

      {/* modal (alerta) que aparece quando o usuário tenta fazer uma busca vazia */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Busca vazia</Modal.Title>
          </Modal.Header>
          <Modal.Body>Por favor, digite algo no campo de usuário.</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
              Fechar
            </Button>
          </Modal.Footer>
      </Modal>
      
    </Container>
    </>
  )
}

function UserCard({user}) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUserData() {      //função que busca os dados do usuário na API do GitHub
      try{
        setLoading(true)

        const response = await fetch(`${base_url}${user}`)
        
        if (!response.ok) {     //verifica se a resposta da API é válida e identifica erros de HTTP
          throw new Error(`Erro HTTP: ${response.status}`)
        }
        
        const data = await response.json()

        setUserData(data)
        setError(null)
      }
      catch(error){ 
        console.log(error)

        setError(error)
        setUserData(null)
        
      } finally{            //indica que a requisição foi finalizada, haja sucesso ou não
        setLoading(false)
      }
    }

    if (user) {       //roda a função somente se o usuário não for vazio
      fetchUserData()
    }
  }, [user])
  
  if (loading) {  //animação de loading enquanto os dados estão sendo carregados
    return (
    <Container className='mt-4 centered-container'> 
      <Spinner animation="border" variant="primary"/>
    </Container>  

  )}
  
  
  if (error || userData === null) {return ( //mensagem de erro quando o usuário não é encontrado
    <Container className='centered-container error-container'> 
      <Card style={{ width: '44rem', height: '5rem', backgroundColor: '#D9D9D9', borderRadius: '10px' }}>
      <Card.Body>
        <p className='errorMessage'>Nenhum perfil foi encontrado com esse nome de usuário.</p>
        <p className='errorMessage'>Tente novamente</p>      
      </Card.Body>
    </Card>
  </Container> 
  )}
  
  //layout do card de usuário
  //exibe o nome, a foto de perfil e a bio do usuário
  //caso não tenha bio e/ou nome, exibe uma mensagem padrão
  
  return (<>
  <Container className='centered-container mb-3'> 
    <Card id='usercard' style={{ width: '51rem', height: '16rem', borderRadius: '25px' }}>
      <Card.Body>
        <Row className="h-100 d-flex align-items-center gap-lg-5 gap-md-3 gap-sm-1  ">
          <Col lg={3} md={4} sm={5}>
            <Image src={userData.avatar_url}
                  roundedCircle
                  id='usercard-img'
                  className='text-center'
          />
          </Col>
          <Col>
            <Stack direction="vertical" className="text-card">
              <p className="text-primary fs-5 mb-2" id='name-user'>{userData.name || 'Usuário sem nome'}</p>
              <p className="text-grey fs-6 mt-0">{userData.bio || 'O usuário não possui bio'}</p>
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
