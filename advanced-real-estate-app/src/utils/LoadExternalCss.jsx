import { useEffect } from "react";

const LoadExternalCss = () => {
  useEffect(() => {
    // Function to create and add link tags
    const addCssLink = (href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.type = "text/css";
      document.head.appendChild(link);
    };

    // Add external CSS links
    addCssLink("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
    addCssLink("https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css");
    addCssLink("https://cdnjs.cloudflare.com/ajax/libs/tempusdominus-bootstrap-4/5.39.0/css/tempusdominus-bootstrap-4.min.css");
    addCssLink("https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css");

    // Clean up function to remove link tags when the component unmounts
    return () => {
      const links = document.head.querySelectorAll("link[rel='stylesheet']");
      links.forEach((link) => {
        if (link.href.includes("animate.css") || 
            link.href.includes("OwlCarousel2") || 
            link.href.includes("tempusdominus-bootstrap-4") || 
            link.href.includes("bootstrap")) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  return null; // This component does not render any visible element
};

export default LoadExternalCss;
