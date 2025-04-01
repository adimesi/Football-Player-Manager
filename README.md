axios
npm install @mui/material @mui/icons-material @mui/x-data-grid react-hook-form papaparse axios


### **README.md**

```markdown
# Football Player Manager

A full-stack application to manage football players, including CRUD operations, filtering, and bulk CSV uploads.

---

## **Steps to Run the Application**
 ## With docker:
 ### Frontend:
 1. build the front docker:
 ```bash
   cd docker
   docker build -f .\Dockerfile_frontend .. -t front:latest
```
2. build the back docker:
 ```bash
 docker build -f .\Dockerfile_backend .. -t back:latest  
```
3. run the docker compose:
 ```bash
 docker-compose -f docker-compose.yml up -d 
 ```
## Without docker:

# Setting Up MySQL with Docker

1. Create a Docker Container for MySQL
```bash
docker run -p 3306:3306 --name database -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql
```

2. Access the Container and Create a New Database
```bash
docker exec -it database sh
sh-5.1# mysql --password
mysql> SHOW DATABASES;
mysql> CREATE DATABASE springboot_db;
```

### **Backend Setup**
1. Ensure you have Java 17+ and Maven installed.
2. Navigate to the demo backend directory:
   ```bash
   cd demo
   ```
3. Install dependencies and build the project:
   ```bash
   mvn clean install
   ```
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
5. The backend will be available at `http://localhost:8080`.

### **Frontend Setup**
1. Ensure you have Node.js and npm installed.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the React development server:
   ```bash
   npm start
   ```
5. The frontend will be available at `http://localhost:3000`.

---

## **Example API Requests**

### **1. Create a Player**
**Request:**
```bash
curl -X POST http://localhost:8080/api/player \
-H "Content-Type: application/json" \
-d '{
  "firstName": "Lionel",
  "lastName": "Messi",
  "nationalities": ["Argentina"],
  "dateOfBirth": "1987-06-24",
  "positions": ["Forward", "Right Winger"],
  "height": 170
}'
```

**Response:**
```json
{
  "id": 1,
  "firstName": "Lionel",
  "lastName": "Messi",
  "nationalities": ["Argentina"],
  "dateOfBirth": "1987-06-24",
  "positions": ["Forward", "Right Winger"],
  "height": 170,
  "createAt": "2025-04-01T12:00:00",
  "updatedAt": "2025-04-01T12:00:00"
}
```

### **2. Get All Players**
**Request:**
```bash
curl -X GET http://localhost:8080/api/player
```

**Response:**
```json
[
  {
    "id": 1,
    "firstName": "Lionel",
    "lastName": "Messi",
    "nationalities": ["Argentina"],
    "dateOfBirth": "1987-06-24",
    "positions": ["Forward", "Right Winger"],
    "height": 170
  }
]
```

### **3. Bulk Upload Players**
**Request:**
Use Postman or a similar tool to send a `POST` request to `http://localhost:8080/api/player/bulk-upload` with a CSV file in the `form-data` body.

---

## **Example CSV File**

Save the following content as `Example.csv`:
### **Example.csv**

```csv
firstName,lastName,nationalities,dateOfBirth,positions,height
Lionel,Messi,Argentina,1987-06-24,Forward,Right Winger,170
Cristiano,Ronaldo,Portugal,1985-02-05,Forward,Left Winger,187
Neymar,Junior,Brazil,1992-02-05,Forward,Left Winger,175
```

## **Future Improvements**
- Add authentication and role-based access control.
- Implement pagination for large datasets.
- Enhance error handling for bulk uploads.
```
