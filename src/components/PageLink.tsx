import type { MouseEvent } from 'react';
import { Link, useNavigate, type LinkProps, type To } from 'react-router-dom';
import { isModifiedClick, leavePage } from '../lib/pageTransition';

/**
 * A link to another page of the site that cross-fades there (see
 * lib/pageTransition) rather than switching at once. Still a real link: it
 * opens in a new tab and works without JavaScript.
 */
export default function PageLink({ to, onClick, ...rest }: LinkProps & { to: To }) {
  const navigate = useNavigate();
  const go = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (isModifiedClick(e)) return;
    e.preventDefault();
    leavePage(() => navigate(to));
  };
  return <Link to={to} onClick={go} {...rest} />;
}
