import json
import requests

base_url = "http://localhost:8081/api"

import requests

def admin_token():
    # Replace with your actual admin token retrieval logic
    email = "admin@example.com"
    password = "adminpassword"
    
    response = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    return response.json().get("token")

def register_user(username, email, password):
    response = requests.post(f"{base_url}/auth/register", json={"name": username, "email": email, "password": password})
    if response.status_code == 200:
        print("User registered successfully.")
    else:
        print(f"Failed to register user: {response.status_code} - {response.text}")
def login(email, password):
    response = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    if response.status_code == 200:
        return response.json().get("token")
    else:
        print(f"Failed to login: {response.status_code} - {response.text}")
        return None
    
def create_category(token, name):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(f"{base_url}/admin/categories", headers=headers, json={"name": name})
    print(response.json())
def categories(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f"{base_url}/admin/categories", headers=headers)
    print(response.json())

def create_product(token, product, images):
    headers = {'Authorization': f'Bearer {token}'}
    image_files = [
        ('images', ('image1.jpg', open('quan_dui.jpg', 'rb'), 'image/jpeg')),
        ('images', ('image2.jpg', open('quan_dui_2.jpg', 'rb'), 'image/jpeg'))
    ]
    
    response = requests.post(f"{base_url}/admin/products", headers=headers,
                         data={'product': json.dumps(product)},  # Chuyển đổi dữ liệu product thành JSON string
                         files=image_files)
    
    if response.status_code == 201:
        print("Product created successfully.")
    else:
        print(f"Failed to create product: {response.status_code} - {response.text}")

def main():

    #create and get categories
    token = admin_token()
    # #create_category(token, "test")
    # create_category(token, "Quần áo nam")
    #create product and add to category
    images = ["quan_dui.jpg", "quan_dui_2.jpg"]

    create_product(token, {"name": "Quần đùi", "price": 100000, "category": "quan-ao-nam"}, images)
    
    # categories(token)

if __name__ == "__main__":
    main()