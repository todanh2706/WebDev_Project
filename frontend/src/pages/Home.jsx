import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'

export default function Home() {
    return (
        <Navbar expand='lg' className='bg-body-tertiary'>
            <Container>
                <Navbar.Brand href='#home'>
                    <img
                        alt=''
                        src='/OA_logo.png'
                        width='30'
                        height='30'
                        className='d-inline-block align-top'
                    />{' '}
                    Online Auction
                </Navbar.Brand>
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                <Navbar.Collapse id='basic-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='#auctions'>Auctions</Nav.Link>
                        <Nav.Link href='#link'>Link</Nav.Link>
                        <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
                            <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
                            <NavDropdown.Item href='#action/3.2'>Another action</NavDropdown.Item>
                            <NavDropdown.Divider />

                            <NavDropdown.Item href='#action/3.3'>Separated Link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}