declare global {
  // eslint-disable-next-line no-var
  var secrets: {
    apiKey?: string;
  };
}

// TODO: document me
export async function register() {
  global.secrets = {};

  // you can fetch from secretmanager here if needed
  global.secrets.apiKey = "None for demo";

  console.log("Secrets loaded!");
}
