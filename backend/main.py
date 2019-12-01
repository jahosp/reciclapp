from flask import Flask
from flask import Flask, request, jsonify
import requests
import json
import os
from flask_pymongo import PyMongo
import datetime
import hashlib

app = Flask(__name__)

app.config["MONGO_URI"] = "mongodb://localhost:27017/myDatabase"
mongo = PyMongo(app)

print(mongo.db)


if __name__ == '_main_':
    app.run(host='0.0.0.0', port=5000)


@app.route('/test', methods=['POST'])
def test():
    return "Todo super xaxi"


@app.route('/register_qr_c', methods=['POST'])
def registrar_bossa_c():
    user_id = request.json['user_id']
    qr_code = request.json['qr_code']

    new_bag = {"user_id": user_id, "qr_code": qr_code, "register_date": datetime.datetime.now()}
    bags_col = mongo.db['bags']
    new_bag_id = bags_col.insert_one(new_bag).inserted_id

    return jsonify(str(new_bag_id)), 201

@app.route('/register_qr', methods=['POST'])
def registrar_bossa():
    user_id = request.json['data']['user_id']
    qr_code = request.json['data']['qr_code']

    new_bag = {"user_id": user_id, "qr_code": qr_code, "register_date": datetime.datetime.now()}
    bags_col = mongo.db['bags']
    new_bag_id = bags_col.insert_one(new_bag).inserted_id

    return jsonify(str(new_bag_id)), 201


@app.route('/pickup_bag', methods=['POST'])
def recollir_bossa():
    correct = request.json['correct']
    qr_code = request.json['qr_code']
    r_type = request.json['r_type']

    print("Correct", correct)

    bag = mongo.db['bags'].find_one({"qr_code": qr_code})
    bag_id = bag['_id']
    new_pickup = {'bag_id': bag_id, 'date': datetime.datetime.now(), 'correct':correct, 'r_type':r_type}

    pickups_col = mongo.db['pickups']
    new_pu_id = pickups_col.insert_one(new_pickup).inserted_id

    return jsonify(str(new_pu_id)), 201


@app.route('/set_user', methods=['POST'])
def insertar_usuario():
    print(request)
    user_name = request.json['name']
    lat = request.json['lat']
    lon = request.json['lon']

    user_col = mongo.db['users']

    new_user = {'name': user_name, 'lat': lat, 'lon': lon}

    new_user_id = user_col.insert_one(new_user).inserted_id

    resp = {'id': str(new_user_id)}

    return jsonify(resp), 201


@app.route('/get_bags_c', methods=['POST'])
def get_bags_c():
    user_id = request.json['user_id']

    pickups_col = mongo.db['pickups']
    bags_col = mongo.db['bags']

    idle_bags = 0
    correct_bags = 0
    wrong_bags = 0

    for bag in bags_col.find({'user_id': user_id}):
        pickups_count = pickups_col.count_documents({'bag_id': bag.get('_id')})
        if pickups_count == 0:
            idle_bags+=1
        else:
            correct_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'True'})
            wrong_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'False'})

            correct_bags+=correct_count
            wrong_bags+=wrong_count

    total_bags = bags_col.count_documents({'user_id': user_id})

    resp = {'idle': idle_bags, 'correct': correct_bags, 'wrong': wrong_bags, 'total': total_bags}

    return jsonify(resp), 201

@app.route('/get_bags', methods=['POST'])
def get_bags():
    user_id = request.json['data']['user_id']

    pickups_col = mongo.db['pickups']
    bags_col = mongo.db['bags']

    idle_bags = 0
    correct_bags = 0
    wrong_bags = 0

    for bag in bags_col.find({'user_id': user_id}):
        pickups_count = pickups_col.count_documents({'bag_id': bag.get('_id')})
        if pickups_count == 0:
            idle_bags+=1
        else:
            correct_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'True'})
            wrong_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'False'})

            correct_bags+=correct_count
            wrong_bags+=wrong_count

    total_bags = bags_col.count_documents({'user_id': user_id})

    resp = {'idle': idle_bags, 'correct': correct_bags, 'wrong': wrong_bags, 'total': total_bags}

    return jsonify(resp), 201

@app.route('/set_tokens', methods=['POST'])
def set_tokens():
    user_id = request.json['user_id']

    correct_bags = 0
    wrong_bags = 0

    pickups_col = mongo.db['pickups']
    bags_col = mongo.db['bags']

    for bag in bags_col.find({'user_id': user_id}):
        pickups_count = pickups_col.count_documents({'bag_id': bag.get('_id')})
        if pickups_count != 0:
            correct_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'True'})
            wrong_count = pickups_col.count_documents({'bag_id': bag.get('_id'), 'correct': 'False'})

            correct_bags += correct_count
            wrong_bags += wrong_count

    metric = (correct_bags-wrong_bags)/(correct_bags+wrong_bags)

    if metric < 0:
        metric = 0

    tokens = metric * 20

    url = 'http://192.168.1.199:2002/enviarRecompensa'
    obj = {'address':'0x559AF77d8E13D1C4253A3fD64A289b22DF208DFe', 'money':tokens}

    resp = requests.post(url, json=obj, headers={"Content-Type": "application/json"})
    print(resp)

    return resp.text

@app.route('/send_hash', methods=['POST'])
def send_hash():
    user_id = request.json['user_id']

    pickups_col = mongo.db['pickups']
    bags_col = mongo.db['bags']

    super_str = ""

    today = datetime.date.today()
    for bag in bags_col.find():
        super_str+=str(bag)
        for pu in pickups_col.find({'bag_id': bag.get('_id')}):
            super_str+=str(pu)

    m = hashlib.sha1()
    m.update(super_str.encode('utf-8'))
    hashed = m.hexdigest()
    print(hashed)
    url = 'http://192.168.1.199:3003/saveHash'
    obj = {'timestamp':str(today), 'data_hash':hashed}
    print(obj)
    resp = requests.post(url, json=obj, headers={"Content-Type": "application/json"})
    print(resp)
    
    return resp.text


@app.route('/validate_hash', methods=['POST'])
def validate_hash():
    user_id = request.json['user_id']

    pickups_col = mongo.db['pickups']
    bags_col = mongo.db['bags']

    super_str = ""

    today = datetime.date.today()
    for bag in bags_col.find():
        super_str += str(bag)
        for pu in pickups_col.find({'bag_id': bag.get('_id')}):
            super_str += str(pu)

    m = hashlib.sha1()
    m.update(super_str.encode('utf-8'))
    hashed = m.hexdigest()
    print(hashed)
    url = 'http://192.168.1.199:3003/validateHash'
    obj = {'timestamp': str(today), 'data_hash': hashed}
    print(obj)
    resp = requests.post(url, json=obj, headers={"Content-Type": "application/json"})
    print(resp)

    return resp.text
