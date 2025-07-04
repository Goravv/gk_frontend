import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../app/Slices/authslice';
import { Button } from 'react-bootstrap';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return <Button variant="danger" onClick={handleLogout}>Logout</Button>;
}

export default LogoutButton;
