
const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-center py-6 mt-auto border-t">
      <p className="text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} PalmVerse. All rights reserved.
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Palm readings are for entertainment purposes only.
      </p>
    </footer>
  );
};

export default Footer;
