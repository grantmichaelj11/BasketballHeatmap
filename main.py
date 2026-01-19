from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

hostname = os.getenv('DB_HOST')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
port = int(os.getenv('PORT'))
mens = os.getenv('MENS')
womens = os.getenv('WOMENS')

app = FastAPI()

# Allow requests from your frontend
origins = [
    "http://localhost:5173",  # your React dev server
    "http://127.0.0.1:5173",  # sometimes React uses this
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all (not recommended in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SeasonsData(BaseModel):
    year: str
    
@app.get(
    "/GetAllSeasons/{mens_or_womens}/",
    response_model=List[SeasonsData]
)
async def GetAllSeasons(mens_or_womens: str):
    #Select Database
    if mens_or_womens.lower() == 'mens':
        database = mens
    elif mens_or_womens.lower() == 'womens':
        database = womens

    try:

        with pymysql.connect(host=hostname, port=port, user=username, password=password, database=database, cursorclass=pymysql.cursors.DictCursor) as conn:
            cursor = conn.cursor()
            sql_statement = """SELECT DISTINCT(seasons.year) FROM boxscores
            LEFT JOIN dates on boxscores.gamedate = dates.iD
            LEFT JOIN seasons on dates.season = seasons.id
            ORDER BY seasons.year DESC;"""
            cursor.execute(sql_statement)

            rows = cursor.fetchall()

            return rows
        

    except pymysql.Error as e:
        raise HTTPException(status_code=500, detail="Internal Error with Database")

class TeamData(BaseModel):
    team: str

@app.get(
    "/GetTeamsInSeason/{mens_or_womens}/{season}",
    response_model = List[TeamData]
)
async def GetTeamsInSeason(mens_or_womens: str, season: str):
    #Select Database
    if mens_or_womens.lower() == 'mens':
        database = mens
    elif mens_or_womens.lower() == 'womens':
        database = womens

    try:

        with pymysql.connect(host=hostname, port=port, user=username, password=password, database=database, cursorclass=pymysql.cursors.DictCursor) as conn:
            cursor = conn.cursor()
            cursor.execute("CALL GetTeamsInSeason(%s)", (season,))

            rows = cursor.fetchall()

            return rows

    except pymysql.Error as e:
        raise HTTPException(status_code=500, detail="Internal Error with Database")
    
@app.get(
    "/GetOpponentsInSeason/{mens_or_womens}/{season}/{selected_team}",
    response_model = List[TeamData]
)
async def GetOpponentsInSeason(mens_or_womens: str, season: str, selected_team: str):
    # This function specifically grabs ALL the stats, and not team specific stats
    if mens_or_womens.lower() == 'mens':
        database = mens
    elif mens_or_womens.lower() == 'womens':
        database = womens

    try:

        with pymysql.connect(host=hostname, port=port, user=username, password=password, database=database, cursorclass=pymysql.cursors.DictCursor) as conn:
            cursor = conn.cursor()
            cursor.execute("CALL GetOpponentsInSeason(%s, %s)", (selected_team, season))

            rows = cursor.fetchall()

            return rows

    except pymysql.Error as e:
        raise HTTPException(status_code=500, detail="Internal Error with Database")
    
class ShootingHeatMap(BaseModel):
    TwoPointMade: int
    TwoPointMissed: int
    ThreePointMade: int
    ThreePointMissed: int
    And1: int

@app.get(
        "/GetTeamDirectionalData/{mens_or_womens}/{team_name}/{season}",
        response_model=Dict[str, ShootingHeatMap])
async def GetTeamDirectionalData(mens_or_womens: str, team_name: str, season: str):
    #Select Database
    if mens_or_womens.lower() == 'mens':
        database = mens
    elif mens_or_womens.lower() == 'womens':
        database = womens

    #Connect to database:
    try:

        with pymysql.connect(host=hostname, port=port, user=username, password=password, database=database, cursorclass=pymysql.cursors.DictCursor) as conn:
            cursor = conn.cursor()
            cursor.execute("CALL GetTeamPlayDirectionDataSeason(%s, %s)", (team_name, season))

            rows = cursor.fetchall()

            results = {}

            for row in rows:
                direction = row['Direction'] or "Unknown"
                value = {k: v for k, v in row.items() if k != "Direction"}
                results[direction] = value

            return results
        
    except pymysql.Error as e:
        raise HTTPException(status_code=500, detail="Internal Error with Database")

@app.get(
    "/GetTeamPlayDirectionDataSeasonAgainstOpponent/{mens_or_womens}/{selected_team}/{opponent}/{season}",
    response_model=Dict[str, ShootingHeatMap])
async def GetTeamPlayDirectionDataSeasonAgainstOpponent(mens_or_womens: str, season: str, selected_team: str, opponent: str):
    # This function specifically grabs ALL the stats, and not team specific stats
    if mens_or_womens.lower() == 'mens':
        database = mens
    elif mens_or_womens.lower() == 'womens':
        database = womens

    try:

        with pymysql.connect(host=hostname, port=port, user=username, password=password, database=database, cursorclass=pymysql.cursors.DictCursor) as conn:
            cursor = conn.cursor()
            cursor.execute("CALL GetTeamPlayDirectionDataSeasonAgainstOpponent(%s, %s, %s)", (selected_team, opponent, season))

            rows = cursor.fetchall()

            results = {}

            for row in rows:
                direction = row['Direction'] or "Unknown"
                value = {k: v for k, v in row.items() if k != "Direction"}
                results[direction] = value

            return results

    except pymysql.Error as e:
        raise HTTPException(status_code=500, detail="Internal Error with Database")
    
