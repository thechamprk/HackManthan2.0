import ChatInterface from '../components/ChatInterface';
import Analytics from '../components/Analytics';

function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:px-8">
      <ChatInterface />
      <Analytics />
    </main>
  );
}

export default Home;
