import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe } from '../../redux/slices/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, isAuthenticated, user]);

  return children;
};

export default AuthInitializer;
