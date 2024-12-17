#!/bin/bash

# Base URL for the API
BASE_URL="http://127.0.0.1:5000"

# Function to check if the last command was successful
check_result() {
  if [ $? -eq 0 ]; then
    echo -e "\033[32mSuccess\033[0m"
  else
    echo -e "\033[31mFailure\033[0m"
  fi
}

# 1. Login and get tokens
echo "1. Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "sophie.martin@email.com",
    "password": "hashed_password_2"
  }')

# Extract tokens using jq
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refresh_token')

if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
  echo "Access Token: $ACCESS_TOKEN"
  echo "Refresh Token: $REFRESH_TOKEN"
  echo -e "\033[32mLogin Successful\033[0m"
else
  echo -e "\033[31mLogin Failed: Unable to retrieve tokens\033[0m"
  exit 1
fi

# 2. Testing Protected Route
echo "2. Testing Protected Route..."
PROTECTED_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/library/books" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

echo $PROTECTED_RESPONSE

if [ "$PROTECTED_RESPONSE" -eq 200 ]; then
  echo -e "\033[32mProtected Route Access Successful\033[0m"
else
  echo -e "\033[31mProtected Route Access Failed (HTTP Code: $PROTECTED_RESPONSE)\033[0m"
fi

# 3. Testing Refresh Token
echo "3. Testing Refresh Token..."
REFRESH_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\": \"${REFRESH_TOKEN}\"}")

NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.access_token')

if [ "$NEW_ACCESS_TOKEN" != "null" ] && [ -n "$NEW_ACCESS_TOKEN" ]; then
  echo "New Access Token: $NEW_ACCESS_TOKEN"
  echo -e "\033[32mRefresh Token Successful\033[0m"
else
  echo -e "\033[31mRefresh Token Failed\033[0m"
fi

# 4. Testing Logout
echo "4. Testing Logout..."
LOGOUT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/auth/logout" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$LOGOUT_RESPONSE" -eq 200 ]; then
  echo -e "\033[32mLogout Successful\033[0m"
else
  echo -e "\033[31mLogout Failed (HTTP Code: $LOGOUT_RESPONSE)\033[0m"
fi

# 5. Testing Blacklisted Token (after logout)
echo "5. Testing Blacklisted Token..."
BLACKLISTED_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/library/books" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}")

if [ "$BLACKLISTED_RESPONSE" -eq 401 ]; then
  echo -e "\033[32mBlacklisted Token Rejected as Expected\033[0m"
else
  echo -e "\033[31mBlacklisted Token Test Failed (HTTP Code: $BLACKLISTED_RESPONSE)\033[0m"
fi
