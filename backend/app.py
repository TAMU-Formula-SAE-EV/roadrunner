from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
import redis
import time

app = Flask(__name__)
socketio = SocketIO(app)

r = redis.Redis(host='localhost', port=6379, db=0)

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
    r.hset(id_value, mapping={'value': float_value, 'timestamp': timestamp})
    socketio.emit('some_id', {'id': id_value, 'value': float_value, 'timestamp': timestamp})
    return 'Entry added', 200

@socketio.on('connect')
def handle_connect():
    print('Connected')

if __name__ == '__main__':
    socketio.run(app, debug=True)
