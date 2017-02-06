# gndapts

## Installing it locally

1. Clone this repo

   ```
   git@github.com:dopeboy/gndapts.git
   ```

2. Create a virtual environment in the project folder (assuming you have python3 installed):
   ```
   cd gndapts
   virtualenv -p python3 venv
   ```

3. Load the virtual environment:
   ```
   source venv/bin/activate
   ```
   
4. Install all the python and node.js depedencies:

    ```
    pip3 install -r requirements.txt
    npm install
    ```

5. Install postgres. Create a user called 'postgres' and give them a password of 'admin'. Create a database called 'mydb' and make sure this postgres user can access it.
    
## Running it locally

1. Start the backend server in the terminal where you ran the `source` command above:

    ```
    python src/manage.py runserver 
    ```
   
2. Run the migrations

    ```
    python src/manage.py migrate
    ```
    
3. Start the frontend server in another terminal:

    ```
    npm run dev
    ```
    
4. Install the fixtures:

    ```
    python src/manage.py loaddata src/base/fixtures/initial_data.json
    ```

5. Create a superuser:

    ```
    python src/manage.py createsuperuser
    ```
    
6. Go to localhost:8000/admin and login with the credentials from above. Create a user and then logout of the admin panel. Then login to the main site.

## Development process

1. Everytime you work on a new feature, create a branch for it. 

    ```
    git pull origin master
    git checkout -b <feature_name>
    ```

2. Any code you add or change should go only on that new branch. Once you're done making changes, commit and push:

    ```
    git commit -m "<insert msg here>"
    git push origin <branch name>
    ```
    
3. Go to github and submit a pull request. Please fill out details about what you changed and how you made your changes. I will look it over and approve.
# react-dJango-Rest-google-map-Integration
