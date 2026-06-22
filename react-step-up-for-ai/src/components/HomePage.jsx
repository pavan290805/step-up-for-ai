import homeHtml from '../legacy/home.html?raw';
import { useLegacyStyle } from '../hooks/useLegacyStyle.js';

const homeStyle = homeHtml.match(/<style>([\s\S]*?)<\/style>/i)?.[1] ?? '';
const homeBody = homeHtml.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? '';

export default function HomePage() {
  useLegacyStyle('stepup-home-style', homeStyle);
  document.title = 'StepUp Intern';

  return <div dangerouslySetInnerHTML={{ __html: homeBody }} />;
}
