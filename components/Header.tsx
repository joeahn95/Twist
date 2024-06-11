interface HeaderProps {
  title: string;
  subTitle?: string;
}

export default function Header({ title, subTitle = "" }: HeaderProps) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        <strong>{title}</strong>
        {subTitle !== "" ? (
          <>
            <br />
            {subTitle}
          </>
        ) : (
          <></>
        )}
      </p>
    </div>
  );
}
