import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Root from './pages/Root';
import Error from './pages/Error';
import Rankings from './pages/Rankings';
import ChooseSeries from './pages/ChooseSeries';
import NewRanking from './pages/NewRanking';
import UpdateRanking from './pages/UpdateRanking';
import SingleRanking from './pages/SingleRanking';
import UserRankings from './pages/UserRankings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import {ContextProvider} from './store/context';

const router = createBrowserRouter([
  {path: '/', element: <Root/>, errorElement: <Error/>, children: [
    {index: true, element: <Rankings/>},
    {path: '/choose-series', element: <ChooseSeries/>},
    {path: '/new-ranking/:seriesId', element: <NewRanking/>},
    {path: '/update-ranking/:rankingId/:seriesId', element: <UpdateRanking/>},
    {path: '/view-ranking/:rankingId', element: <SingleRanking/>},
    {path: '/user-rankings', element: <UserRankings/>},
    {path: '/login', element: <Login/>},
    {path: '/signup', element: <Signup/>}
  ]}
]);

export default function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router}/>
    </ContextProvider>
  );
}