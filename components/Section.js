import Link from "next/link";
import Button from "./Button";

const Section = ({
  title,
  subtitle,
  color = "light",
  content,
  href,
  linkLabel,
}) => {
  const styles = {
    light: {
      header: "bg-[#f2f2f2]",
      content: "bg-[#ffffff]",
      text: null,
    },
    dark: {
      header: "bg-[#3d3d3d]",
      content: "bg-[#404040]",
      text: "text-white",
    },
  };

  return (
    <section className={`${styles[color].text}`}>
      <div className={`py-5 text-center ${styles[color].header}`}>
        <div className="md:top-32 md:origin-center md:-rotate-90 md:transform md:font-bold">
          <h2 className="font-serif text-3xl font-[400]">{title}</h2>
        </div>
        <div className="text-sm font-thin uppercase tracking-wide">
          {subtitle}
        </div>
      </div>
      <div
        className={`flex min-h-[175px] flex-col items-center space-y-10 p-5 ${styles[color].content}`}
      >
        <div className="text-center text-lg">{content}</div>
        <Button>
          <Link href={href}>{linkLabel}</Link>
        </Button>
      </div>
    </section>
  );
};

export default Section;
