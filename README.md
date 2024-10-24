If you have not run the application before, you may need to setup redis (the backend database) (these instructions are for windows). 
1. Download using this link: https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip
2. Extract the files to C:/Program Files/redis
3. Dev script should take care of starting the server

To start the application use ./dev.sh. This script will install dependencies and then start the back and frontend applications. You can also use --quiet-front and --quiet-back to silence the log outputs of the services to make debugging a bit easier. The script assumes you have npm, python3 and redis set up prior to running the application.

$ ./dev.sh

If you're not on windows, the basic steps to run the application are as follows: 
1. Start the redis server
2. Download the python + node dependencies 
3. Run the back and front end applications

Making a new widget type: 
1. use "empty widget" and "basic widget" as inspo
2. Make a new folder in frontend/src/widgets
3. Make the widget component in the folder (make sure to use the WidgetWrapper component)
4. Make a new enum type for your widget in frontend/src/widgets/manifest.tsx
5. Add the widget to the menu layout (see frontend/src/dashboard/menu/manifest.tsx)
