import { useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from 'react-router-dom';
import { getFlatLinks, getAliases, withSkin } from './helpers';

const flatLinks = getFlatLinks();
const defaultRoute = withSkin(flatLinks[0][0], 'willow');

// an alias opens the canonical route with the same skin
function AliasRedirect({ route }) {
  const { skin } = useParams();
  return <Navigate to={withSkin(route, skin)} replace />;
}

export default function Router({ onRouteChange }) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') onRouteChange(location.pathname);
  }, [location.pathname, onRouteChange]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute} replace />} />
      {flatLinks.map(([path, , Component]) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      {[...getAliases()].map(([alias, a]) => (
        <Route
          key={alias}
          path={alias}
          element={<AliasRedirect route={a[0]} />}
        />
      ))}
    </Routes>
  );
}
