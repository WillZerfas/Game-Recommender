import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function Favorites() {

    const navigate = useNavigate()

    const goToHome = () => {
        sessionStorage.removeItem('username')
        navigate('/')
    }
    const goToSearch = () => navigate('/search')
    const goToGameHub = () => {
        navigate('/gamehub'); // Navigate to Home page
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <Button onClick={goToHome} className="home-button" variant="secondary">
                    Back to Home
                </Button>
                <Button onClick={goToGameHub} className="home-button" variant="secondary">
                    GameHub!
                </Button>
            </div>
            {/* Add other content for the Favorites page here */}
        </div>
    );

}

export default Favorites;