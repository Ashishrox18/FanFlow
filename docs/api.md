# API Reference

FanFlow AI exposes REST Route Handlers to perform structured GenAI integrations.

## 1. Post /api/ai/assistant

Main multilingual conversational assistant routing.

- **Request Body**:
  ```json
  {
    "message": "string",
    "language": "English|Spanish|French|Portuguese|Hindi|Japanese|Arabic",
    "stadiumId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "answer": "string",
      "category": "Navigation|Emergency|Accessibility|Transportation|General|Ticketing",
      "suggestedActions": ["string"]
    }
  }
  ```

## 2. Post /api/ai/navigation

Calculates paths through the stadium.

- **Request Body**:
  ```json
  {
    "stadiumId": "string",
    "from": "string",
    "destination": "Seat|Food|Restroom|Medical|Merchandise|AccessibilityRoute",
    "isAccessibilityMode": boolean,
    "language": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "shortestRoute": [{ "stepNumber": 1, "instruction": "string", "isAccessible": true }],
      "walkingTime": "string",
      "crowdLevel": "Low|Medium|High",
      "reason": "string"
    }
  }
  ```

## 3. Get /api/crowd

Retrieves live simulated zone updates.

- **Parameters**: `stadiumId` (query param)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "stadiumId": "string",
      "zones": [
        {
          "id": "string",
          "name": "string",
          "crowdLevel": "Low",
          "capacityPercent": 20,
          "waitTimeMinutes": 3,
          "isOperational": true
        }
      ]
    }
  }
  ```
