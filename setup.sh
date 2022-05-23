echo '127.0.0.1 flashmemo.edu' | sudo tee -a /etc/hosts
npm install -g @angular/cli
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt install google-chrome-stable
sudo apt install google-chrome-stable -y
