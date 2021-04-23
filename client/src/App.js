import './App.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { initWeb3 } from './store/adoptSlice';
import { PetList } from './components/PetList';
// import { ErrorHandling } from './components/ErrorHandling';

function App() {
  const dispatch = useDispatch();
  
  // const web3 = useSelector((state)=>{
  //   console.log("state in app= ",state);
  //   return state.adoptReducer.web3
  // })
 
  useEffect(()=>{
    dispatch(initWeb3());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <h3 style={{textAlign: 'center'}}>Pet-Shop Dapp</h3>
      {/* <ErrorHandling /> */}
      <div>
      <PetList></PetList>
      </div>
    </div>
  );
}

export default App;

