import { useState, useEffect, useCallback } from 'react';
import {
  HashRouter,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { Willow } from '@svar-ui/react-core';

import Router from './Router';
import { getLinks, findLink } from './helpers';
import { GitHubLogoIcon, LogoIcon } from '../assets/icons';
import './Index.css';

function DemoExplorerContent({
  productTag,
  publicName,
  skins,
  Globals,
  Button,
  Segmented,
}) {
  const navigate = useNavigate();
  const links = getLinks();
  const [skin, setSkin] = useState(skins[0].id);
  const [show, setShow] = useState(true);

  const location = useLocation();
  const parts = location.pathname.split('/');
  // an alias resolves to its canonical entry, so the page segment,
  // title and code link follow the canonical route
  const matched = findLink(`/${parts[1]}/:skin`);
  const page = matched ? matched[0].split('/')[1] : parts[1];
  const title = matched ? matched[1] : '';
  const baseLink =
    'https://github.com/svar-widgets/react-' +
    productTag +
    '/tree/main/demos/cases/';

  const props = matched ? matched[3] || {} : {};
  const name = props.file || matched?.[1] || '';
  // Pro samples are not in the public GitHub mirror, so they get no link
  const githubLink = props.pro
    ? null
    : `${baseLink}${name.replace(/\s+/g, '')}.jsx`;

  const handleRouteChange = useCallback((path) => {
    const newSkin = path.split('/')[2];
    if (newSkin) setSkin(newSkin);
  }, []);

  const handleSkinChange = ({ value }) => {
    setSkin(value);
    if (page) {
      navigate(`/${page}/${value}`);
    }
  };

  const toggleSidebar = () => {
    setShow(!show);
  };

  useEffect(() => {
    document.body.className = `wx-${skin}-theme`;
  }, [skin]);

  const SkinComponent = (skins.find((s) => s.id === skin) || skins[0])
    .Component;

  return (
    <div className="wx-demos layout">
      <div
        className={`wx-demos sidebar ${show ? 'active' : ''}`}
        role="tabpanel"
      >
        <div className="wx-demos sidebar-content">
          <div className="wx-demos sidebar-header">
            <div className="wx-demos box-title">
              <a
                href="https://svar.dev/react/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={LogoIcon} alt="Logo icon" className="box-title-img" />
              </a>
              <div className="wx-demos separator"></div>
              <a
                href={`https://svar.dev/react/kanban/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h1 className="wx-demos title">React {publicName}</h1>
              </a>
            </div>
            <div className="wx-demos btn-box">
              <Button
                type="secondary"
                icon="wxi-angle-left"
                css="toggle-btn"
                onClick={toggleSidebar}
              ></Button>
            </div>
          </div>
          <div className="wx-demos box-links">
            {links.map((group) => (
              <div key={group.group}>
                {group.group && (
                  <div className="wx-demos group-title">{group.group}</div>
                )}
                {group.items.map((data) => (
                  <NavLink
                    key={data[0]}
                    to={data[0].replace(':skin', skin)}
                    className={({ isActive }) =>
                      `wx-demos demo ${isActive ? 'active' : ''}`
                    }
                  >
                    {data[1]}
                    {data[3] && data[3].pro && <span className="pro">PRO</span>}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wx-demos page-content">
        <div className="wx-demos page-content-header">
          <div className="wx-demos header-title-box">
            {!show && (
              <div className="wx-demos btn-box">
                <Button
                  type="secondary"
                  icon="wxi-angle-right"
                  css="toggle-btn"
                  onClick={toggleSidebar}
                />
              </div>
            )}
            <div className="wx-demos hint">{title}</div>
          </div>
          <div className="wx-demos header-actions-container">
            <div className="wx-demos segmented-box">
              <Segmented
                value={skin}
                options={skins}
                css="segmented-themes"
                onChange={handleSkinChange}
              />
            </div>
            {githubLink && (
              <div className="wx-demos btn-box">
                <a href={githubLink} target="_blank" rel="noopener noreferrer">
                  <Button type="secondary" css="toggle-btn">
                    <img src={GitHubLogoIcon} alt="GitHub icon" />
                    See code on GitHub
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="wx-demos wrapper-content" role="none">
          <div
            className={`wx-demos content wx-${skin}-theme`}
            role="none"
            data-wx-portal-root="true"
          >
            <Globals>
              <SkinComponent>
                <Router skin={skin} onRouteChange={handleRouteChange} />
              </SkinComponent>
            </Globals>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DemoExplorer(props) {
  return (
    <>
      <Willow />
      <HashRouter>
        <DemoExplorerContent {...props} />
      </HashRouter>
    </>
  );
}
