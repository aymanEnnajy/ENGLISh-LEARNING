import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex pt-4 pb-24 lg:pb-8">
          <Sidebar />
          <main className="flex-1 lg:ml-24 desktop:ml-72 animate-fade-in w-full">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
