import Footer from "./PublicFooter";
import Header from "./PublicHeader";

const PublicLayout = ({ children }) => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="grow">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default PublicLayout;
