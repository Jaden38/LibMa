from flask import Flask, render_template

app = Flask(__name__)
# Config options - Make sure you created a 'config.py' file.
app.config.from_object('config')
# To get one variable, tape app.config['MY_VARIABLE']
@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'

@app.route('/base')
def view_base():  # put application's code here
    return render_template('base.html')

if __name__ == '__main__':
    app.run()
