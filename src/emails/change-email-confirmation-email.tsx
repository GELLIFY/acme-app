import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type ResetPasswordEmailProps = {
  user?: { name: string };
  newEmail?: string;
  url?: string;
};

export default function ChangeEmailConfirmationEmail({
  user,
  newEmail,
  url,
}: Readonly<ResetPasswordEmailProps>) {
  const previewText = `Change your Acme App email`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
        }}
      >
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Change your <strong>Acme App</strong> email
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Hello {user?.name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              We received a request to change the email address for your Acme
              App account to <strong>{newEmail}</strong>. Click the link below
              to confirm that this is the right address.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={url}
              >
                Change Email
              </Button>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Or copy and paste this URL into your browser:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you didn't request a email change, please ignore this email or
              contact support if you have concerns.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
