## How do I deploy this? (DEPRECATED)

![alt text](./docs/acme_app-charmender-infra.png)

#### Prerequisites

1. ✅ Purchase a domain name
2. ✅ Purchase a Linux Ubuntu server (e.g. droplet)
3. ✅ Docker
4. 😌 That's it!

#### Quickstart

1. SSH into your server:

```sh
ssh root@your_server_ip
```

2. Create a SSH key pair:

```sh
ssh-keygen -t ed25519 -C "name.surname@gellify.com"
# Enter a file in which to save the key (/home/YOU/.ssh/id_ALGORITHM):[Press enter]
# Enter passphrase (empty for no passphrase): [Type a passphrase]
# Enter same passphrase again: [Type passphrase again]

eval "$(ssh-agent -s)"

ssh-add ~/.ssh/id_ed25519
```

3. Copy the SSH public key to clipboard and add it to your GitHub or BitBucket account:

```sh
$ cat ~/.ssh/id_ed25519.pub
# Then select and copy the contents of the id_ed25519.pub file
# displayed in the terminal to your clipboard
```

4. From your shell upload the deployment script via SSH:

```sh
scp -i ~/.ssh/id_ed25519 deploy.sh root@your_server_ip:~
```

5. From inside the server run the deployment script:

> You can modify the email and domain name variables inside of the script to use your own.

```sh
chmod +x ~/deploy.sh
./deploy.sh
```

#### Deploy script

I've included a Bash script **THAT NEEDS ADJUSTMENTS** which does the following:

- Installs all the necessary packages for your server
- Installs Docker, Docker Compose, and Nginx
- Clones this repository
- Generates an SSL certificate
- Builds your Next.js application from the Dockerfile
- Sets up Nginx and configures HTTPS and rate limting
- Sets up a cron which clears the database every 10m
- Creates a .env file with your Postgres database creds
- Once the deployment completes, your Next.js app will be available at:

http://your-provided-domain.com

Next.js app, PostgreSQL database and Keycloak instance will be up and running in Docker containers. To set up your database, you could install npm inside your Postgres container and use the Drizzle scripts.

For pushing subsequent updates, I also provided an update.sh script as an example.
