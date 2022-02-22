import styles from './App.module.scss';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './features/dashboard/Dashboard';
import { MessageBusRenderer } from './features/message-bus/MessageBusRenderer';
import { GlobalStyle } from './styles/globalStyle';
import { EditorRouter } from './features/editor/EditorRouter';

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <div className={styles.container}>
        <MessageBusRenderer />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="editor/:id" element={<EditorRouter />} />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>
    </>
  );
};
