import Section from "../components/Section";

export default function Home() {
  const data = [
    {
      id: 1,
      title: "Pretraga",
      content: "Pretražite sahranjena lica po imenu",
      href: "/search",
      linkLabel: "Idi na pretragu",
    },
    {
      id: 2,
      title: "Statistika",
      content: "Interkativna statistika",
      href: "/statistika",
      linkLabel: "Idi na statistiku",
    },
    {
      id: 3,
      title: "Mapa",
      content: "Pronađite arhivirane lokacija na mapi",
      href: "/map",
      linkLabel: "Idi na mapu",
    },
    {
      id: 4,
      title: "Indeks",
      content: "Indeks svih arhiviranih lokacija",
      href: "/indexMesta",
      linkLabel: "Idi na indeks",
    },
  ];

  return (
    <>
      {data.map(({ id, title, content, href, linkLabel }) => (
        <Section
          key={id}
          title={title}
          content={content}
          href={href}
          linkLabel={linkLabel}
        />
      ))}
    </>
  );
}
