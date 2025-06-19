
const Footer = () => {
  return (
    <footer className="bg-secondary/30 text-center py-6 mt-auto border-t border-primary/20">
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
