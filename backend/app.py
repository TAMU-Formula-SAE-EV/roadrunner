import pandas as pd
from flask import Flask, render_template, request
from flask_socketio import SocketIO
import redis
import time

app = Flask(__name__)
socketio = SocketIO(app)

r = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/')
def entry():
    return render_template('entry.html')

@app.route('/display')
def display():
    return render_template('display.html')

@app.route('/add', methods=['POST'])
def add_entry():
    id_value = request.form.get('id')
    float_value = request.form.get('value')
    timestamp = int(time.time())
    r.rpush(f"{id_value}:values", float_value)
    r.rpush(f"{id_value}:timestamps", timestamp)
    socketio.emit('some_id', {'id': id_value, 'value': float_value, 'timestamp': timestamp})
    return 'Entry added', 200

@socketio.on('connect')
def handle_connect():
    print('Connected')

def simulation():
    df = pd.read_csv("short.csv", header=13)
    df = df.drop([0, 1])
    print("Simulation started")
    for _, row in df.iterrows():
        timestamp = row[0]
        for i in range(1, len(row)):
            column_name = df.columns[i].replace(" ", "")
            r.rpush(f"{column_name}:values", row[i])
            r.rpush(f"{column_name}:timestamps", timestamp)
            socketio.emit('some_id', {'id': column_name, 'value': row[i], 'timestamp': timestamp})
            print("Entry added")
        socketio.sleep(.1)

if __name__ == '__main__':
    socketio.start_background_task(simulation)
    print("Starting")
    socketio.run(app, debug=True, use_reloader=False)
