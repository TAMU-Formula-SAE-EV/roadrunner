If you have not run the application before, you may need to setup redis (the backend database) (these instructions are for windows). 
1. Download using this link: https://github.com/microsoftarchive/redis/releases/download/win-3.0.504/Redis-x64-3.0.504.zip
2. Extract the files to C:/Program Files/redis
3. Dev script should take care of starting the server

To start the application use ./dev.sh. This script will install dependencies and then start the back and frontend applications. You can also use --quiet-front and --quiet-back to silence the log outputs of the services to make debugging a bit easier.

$ ./dev.sh

If you're not on windows, the basic steps to run the application are as follows: 
1. Start the redis server
2. Download the python + node dependencies 
3. Run the back and front end applications

To simulate data streaming into the application, you have two options: 
1. Manual entry: Start the application, go to localhost:5000 and manually enter your data
2. run python3 backend/simulate_data.py in another terminal. It will put transmit a sign wave to as the speed 

Making a new widget type: 
1. use "empty widget" and "basic widget" as inspo
2. Make a new folder in frontend/src/widgets
3. Make the widget component in the folder (make sure to use the WidgetWrapper component)
4. Use the useData hook to access static and time-series data for your widget
5. Make a new enum type for your widget in frontend/src/widgets/manifest.tsx
6. Map your widget enum type to a component in src/widgets/utils/getWidgetComponent.tsx
7. Add the widget to the menu layout (see frontend/src/dashboard/menu/types.tsx)
8. Test it out by accessing your widget using the menu