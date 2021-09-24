import { MainHeader } from "components/header";
import * as React from "react";

import useDarkMode from "../../hooks/useDarkMode";
import s from "./mainWrapper.scss";

interface Props {}

function MainWrapper(props: React.PropsWithChildren<Props>): JSX.Element {
  const { isDarkMode, toggle } = useDarkMode();
  const theme = isDarkMode ? s.dark : s.light;

  return (
    <div className={`${s.mainWrapper} ${theme}`}>
      <div className={`${s.top} ${theme}`}>
        <div className={s.constraint}>
          <MainHeader />
          <button onClick={toggle} className={s.toggleTheme}>
            <span className={s.icon}>{isDarkMode ? "🌙" : "☀️"}</span>
          </button>
        </div>
      </div>
      <div className={`${s.content} ${theme}`}>
        <div className={s.constraint}>
          <div className={s.wrapper}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export { MainWrapper };
