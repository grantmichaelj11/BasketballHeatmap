import { useState, useEffect } from 'react'
import Select  from 'react-select';
import './App.css'

// Creates Background
function CreateBackground({ children }) {
  return (
    <div className="flex min-h-screen bg-[#DEB887]">{children}</div>
  );
}

function CreateContainersForElements( {children}) {
  return (
    <div className="grid grid-cols-5 gap-4 p-4 w-full">
      {children}
    </div>
  );
}

// Creates Dropdown Elements
function GenderSelection ( {selectedGender, setSelectedGender} ) {

  const options = [
    { value: 'mens', label: 'Men' },
    { value: 'womens', label: 'Women' },
  ];

  return (
    <div>
      <h2 className="text-lg font-bold flex justify-left">Gender:</h2>
        <Select
          value={selectedGender}
          onChange={(option) => setSelectedGender(option)}
          options={options}
          placeholder="Men or Women?"
          className="w-fullborder border-black rounded font-bold text-center"
        />
    </div>

  );
}

function SeasonSelection ({gender, selectedSeason, setSelectedSeason, seasonOptions, setSeasonOptions}) {

  const genderValue = gender?.value;

  useEffect(() => {
    // Only fetch if a gender is selected
    if (!gender) return;

    // Else, get the current seasons
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/GetAllSeasons/${genderValue.toLowerCase()}/`);
        const result = await response.json();
        setSeasonOptions(result);
        setSelectedSeason('') // Reset season if gender is changed
      } catch (error) {
        console.error('Error fetching data:' , error);
      }
    };

    fetchData();

  }, [gender]) // Sets dependencies, so if gender changes it will call the function

  const options = seasonOptions.map(season => ({
    value: season.year,
    label: season.year
  }));

  return (
    <div>
      <h2 className="text-lg font-bold flex justify-left">Season:</h2>
        <Select
          value={selectedSeason}
          onChange={(option) => setSelectedSeason(option)}
          options={options}
          placeholder={gender ? "Select Season" : "Select Gender first"}
          isDisabled={!gender}
          isSearchable={true}
          className="w-full border border-black rounded font-bold text-center"
        />
    </div>
  );
}

function TeamSelection ({gender, season, selectedTeam, setSelectedTeam, teamOptions, setTeamOptions}){
  const genderValue = gender?.value;
  const seasonValue = season?.value;

  useEffect(() => {
    // Only fetch if a gender is selected
    if (!gender) return;
    if (!season) return;

    // Else, get the current seasons
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/GetTeamsInSeason/${genderValue.toLowerCase()}/${seasonValue.toLowerCase()}`);
        const result = await response.json();
        setTeamOptions(result);
        setSelectedTeam(null) // Reset season if gender is changed
      } catch (error) {
        console.error('Error fetching data:' , error);
      }
    };

    fetchData();

  }, [gender, season]) // Sets dependencies, so if gender or season changes it will call the function

  const options = teamOptions.map(data => ({
    value: data.team,
    label: data.team
  }));

  return (
    <div>
      <h2 className="text-lg font-bold flex justify-left">Team:</h2>
        <Select
          value={selectedTeam}
          onChange={(option) => setSelectedTeam(option)}
          options={options}
          placeholder={!gender ? "Select Gender first" : !season ? "Select Season first" : "Select Team"}
          isDisabled={!gender || !season}
          isSearchable={true}
          className="border border-black rounded font-bold text-center"
        />
    </div>
  );
}

function OpponentSelection ({gender, season, team, selectedOpponent, setSelectedOpponent, opponentOptions, setOpponentOptions}){
  const genderValue = gender?.value;
  const seasonValue = season?.value;
  const teamValue = team?.value;

  useEffect(() => {
    // Only fetch if a gender is selected
    if (!gender) return;
    if (!season) return;
    if (!team) return;

    // Else, get the current seasons
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/GetOpponentsInSeason/${genderValue.toLowerCase()}/${seasonValue.toLowerCase()}/${teamValue.toLowerCase()}`);
        const result = await response.json();
        setOpponentOptions(result);
        setSelectedOpponent(null) // Reset season if gender is changed
      } catch (error) {
        console.error('Error fetching data:' , error);
      }
    };

    fetchData();

  }, [gender, season, team]) // Sets dependencies, so if gender or season changes it will call the function

  const options = [
    { value: "all", label: "All"},
    ...opponentOptions.map(data => ({
    value: data.team,
    label: data.team
  }))];

  return (
    <div>
      <h2 className="text-lg font-bold flex justify-left">Opponent:</h2>
        <Select
          value={selectedOpponent}
          onChange={(option) => setSelectedOpponent(option)}
          options={options}
          placeholder={!gender ? "Select Gender first" : !season ? "Select Season first" : !team ? "Select Team first" : "Select Opponent"}
          isDisabled={!gender || !season || !team}
          isSearchable={true}
          className="w-full border border-black rounded font-bold text-center"
        />
    </div>
  );
}

function CreateListElements( {
  selectedGender,
  setSelectedGender,
  selectedSeason, 
  setSelectedSeason, 
  seasonOptions, 
  setSeasonOptions,
  selectedTeam,
  setSelectedTeam,
  teamOptions,
  setTeamOptions,
  selectedOpponent,
  setSelectedOpponent,
  opponentOptions,
  setOpponentOptions} ) 
  {
  return (
    <div className="bg-slate-600 border-4 border-black col-span-2 rounded-2xl shadow-lg p-4 w-full h-full">

        {/*Create a drop down for each statistic*/}
        <GenderSelection 
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
        />
        <SeasonSelection 
          gender={selectedGender} 
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          seasonOptions={seasonOptions}
          setSeasonOptions={setSeasonOptions}
        />
        <TeamSelection 
          gender={selectedGender} 
          season={selectedSeason}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          teamOptions={teamOptions}
          setTeamOptions={setTeamOptions}
        />
        <OpponentSelection
          gender={selectedGender}
          season={selectedSeason}
          team={selectedTeam}
          selectedOpponent={selectedOpponent}
          setSelectedOpponent={setSelectedOpponent}
          opponentOptions={opponentOptions}
          setOpponentOptions={setOpponentOptions}
        />
    </div>
  );
}

// Heatmap functionality stats here
function getRedGreenColor(percentage) {
  // Anything 20% or below is red
  if (percentage <= 20) {
    return 'rgb(220, 38, 38)';
  }

  // Anything 40% or above is green
  if (percentage >= 40) {
    return 'rgb(21, 128, 61)';
  }

  // Scale from 20% to 40% (maps 20-40 to 0-100 for the gradient)
  const scaledPercentage = ((percentage - 20) / 20) * 100;

  const redToGreen = [
    [220, 38, 38],    // 20% - red
    [249, 115, 22],   // ~25% - orange
    [234, 179, 8],    // ~30% - yellow
    [132, 204, 22],   // ~35% - lime
    [21, 128, 61]     // 40% - green
  ];

  const p = Math.max(0, Math.min(100, scaledPercentage));
  const index = (p / 100) * (redToGreen.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const t = index - lowerIndex;

  const lower = redToGreen[lowerIndex];
  const upper = redToGreen[upperIndex];

  const r = Math.round(lower[0] + t * (upper[0] - lower[0]));
  const g = Math.round(lower[1] + t * (upper[1] - lower[1]));
  const b = Math.round(lower[2] + t * (upper[2] - lower[2]));

  return `rgb(${r}, ${g}, ${b})`;
}

function CreateCourtElement( {children} ) {
  return (
    <div className="bg-slate-600 border-4 border-black col-span-3 rounded-2xl shadow-lg p-4 w-full h-full">
      <div className="aspect-[500/470] w-full h-full">
        <svg
          viewBox="0 0 560 530"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer boundary */}
          <rect x="10" y="10" width="540" height="450" fill="none" stroke="black" strokeWidth="4" />

          {/* Backboard */}
          <line x1="250" y1="40" x2="310" y2="40" stroke="black" strokeWidth="4" />

          {/* Hoop */}
          <circle cx="280" cy="55" r="10" fill="none" stroke="black" strokeWidth="4" />

          {/* The key (paint) */}
          <rect x="220" y="10" width="120" height="190" fill="none" stroke="black" strokeWidth="4" />

          {/* Free throw circle - top half solid */}
          <path
            d="M 220 200 A 60 60 0 0 1 340 200"
            fill="none"
            stroke="black"
            strokeWidth="4"
          />

          {/* Free throw circle - bottom half dashed */}
          <path
            d="M 220 200 A 60 60 0 0 0 340 200"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeDasharray="8 8"
          />

          {/* 3-point arc */}
          <path
            d="M 80 140 L 80 10 M 80 140 A 200 200 0 0 0 480 140 M 480 140 L 480 10"
            fill="none"
            stroke="black"
            strokeWidth="4"
          />

          {/* Center court line */}
          <line x1="10" y1="460" x2="490" y2="460" stroke="black" strokeWidth="4" />

          {children}

        </svg>
      </div>
    </div>
  );
}

function ShootingCircle({ made, shot, cx, cy, size = 50, color = "#FFFFFF" }) {

  if (shot == 0) {
    color = "#FFFFFF"
  }
  const percentage = shot > 0 ? Math.round((made / shot) * 100) : 0;
  const radius = size / 2;

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r={radius} fill={color} stroke="#000" strokeWidth="2" />
      <circle
        r={radius - 4}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={2 * Math.PI * (radius - 4)}
        strokeDashoffset={2 * Math.PI * (radius - 4) * (1 - percentage / 100)}
        transform="rotate(-90)"
      />
      <text
        x="0"
        y="0"
        textAnchor="middle"
        dominantBaseline="middle"
        fontWeight="bold"
        fontSize={size / 3}
      >
        {percentage}%
      </text>
    </g>
  );
}

function CreateHeatMaps({
  gender,
  season,
  team,
  opponent,
  rightTwoPointersMade, // START RIGHT
  setRightTwoPointersMade,
  rightThreePointersMade,
  setRightThreePointersMade,
  rightTwoPointersShot,
  setRightTwoPointersShot,
  rightThreePointersShot,
  setRightThreePointersShot, // TO CENTER
  centerTwoPointersMade,
  setCenterTwoPointersMade,
  centerThreePointersMade,
  setCenterThreePointersMade,
  centerTwoPointersShot,
  setCenterTwoPointersShot,
  centerThreePointersShot,
  setCenterThreePointersShot, // TO LEFT
  leftTwoPointersMade,
  setLeftTwoPointersMade,
  leftThreePointersMade,
  setLeftThreePointersMade,
  leftTwoPointersShot,
  setLeftTwoPointersShot,
  leftThreePointersShot,
  setLeftThreePointersShot
}) {
  const genderValue = gender?.value;
  const seasonValue = season?.value;
  const teamValue = team?.value;
  const opponentValue= opponent?.value || "";

  useEffect(() => {
    // Only fetch if a gender is selected
    if (!gender) return;
    if (!season) return;
    if (!team) return;

    // Else, get the current seasons
    const fetchData = async () => {
      try {
        let url = ""

        if (opponentValue == "" || opponentValue === "all") {
          url = `http://127.0.0.1:8000/GetTeamDirectionalData/${genderValue.toLowerCase()}/${teamValue.toLowerCase()}/${seasonValue.toLowerCase()}`
          
        } else {
          url = `http://127.0.0.1:8000/GetTeamPlayDirectionDataSeasonAgainstOpponent/${genderValue.toLowerCase()}/${teamValue.toLowerCase()}/${opponentValue.toLowerCase()}/${seasonValue.toLowerCase()}`
        }

        const response = await fetch(url);
        const result = await response.json();
        // Right Side
        const rightSide = result.Right;

        setRightTwoPointersMade(rightSide.TwoPointMade + rightSide.And1);
        setRightTwoPointersShot(rightSide.TwoPointMade + rightSide.TwoPointMissed + rightSide.And1);
        setRightThreePointersMade(rightSide.ThreePointMade);
        setRightThreePointersShot(rightSide.ThreePointMade + rightSide.ThreePointMissed);

        // Center
        const center = result.Center;

        setCenterTwoPointersMade(center.TwoPointMade + center.And1);
        setCenterTwoPointersShot(center.TwoPointMade + center.TwoPointMissed + center.And1);
        setCenterThreePointersMade(center.ThreePointMade);
        setCenterThreePointersShot(center.ThreePointMade + center.ThreePointMissed);

        // Left
        const leftSide = result.Left;

        setLeftTwoPointersMade(leftSide.TwoPointMade + leftSide.And1);
        setLeftTwoPointersShot(leftSide.TwoPointMade + leftSide.TwoPointMissed + leftSide.And1);
        setLeftThreePointersMade(leftSide.ThreePointMade);
        setLeftThreePointersShot(leftSide.ThreePointMade + leftSide.ThreePointMissed);

      } catch (error) {
        console.error('Error fetching data:' , error);
      }



    };

    fetchData();

  }, [genderValue, seasonValue, teamValue, opponentValue]) // Sets dependencies, so if gender or season changes it will call the function


  // These coordinates are relative to your court SVG's viewBox (560 x 530)
  const circles = [
    {
      made: rightTwoPointersMade,
      shot: rightTwoPointersShot,
      cx: 400,
      cy: 100,
      size: 75
    },
    {
      made: rightThreePointersMade,
      shot: rightThreePointersShot,
      cx: 460,
      cy: 280,
      size: 75
    },
    {
      made: centerTwoPointersMade,
      shot: centerTwoPointersShot,
      cx: 280,
      cy: 200,
      size: 75
    },
    {
      made: centerThreePointersMade,
      shot: centerThreePointersShot,
      cx: 280,
      cy: 355,
      size: 75
    },
    {
      made: leftTwoPointersMade,
      shot: leftTwoPointersShot,
      cx: 160,
      cy: 100,
      size: 75
    },
    {
      made: leftThreePointersMade,
      shot: leftThreePointersShot,
      cx: 100,
      cy: 280,
      size: 75
    }
  ];


  return (
    <g>
      {circles.map((circle, idx) => {
        const percentage = circle.shot > 0 
          ? Math.round((circle.made / circle.shot) * 100) 
          : 0;
        
        return (
          <ShootingCircle
            key={`${idx}-${circle.made}-${circle.shot}`}
            made={circle.made}
            shot={circle.shot}
            cx={circle.cx}
            cy={circle.cy}
            size={circle.size}
            color={getRedGreenColor(percentage)}
          />
        );
      })}
    </g>
  );
  
}

// Main App Function here
function App() {
  // Data for dropdown menus
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamOptions, setTeamOptions] = useState([]);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [opponentOptions, setOpponentOptions] = useState([]);

  // Data for heatmaps
  const [rightTwoPointersMade, setRightTwoPointersMade] = useState(0)
  const [rightTwoPointersShot, setRightTwoPointersShot] = useState(0)
  const [rightThreePointersMade, setRightThreePointersMade] = useState(0)
  const [rightThreePointersShot, setRightThreePointersShot] = useState(0)

  const [leftTwoPointersMade, setLeftTwoPointersMade] = useState(0)
  const [leftTwoPointersShot, setLeftTwoPointersShot] = useState(0)
  const [leftThreePointersMade, setLeftThreePointersMade] = useState(0)
  const [leftThreePointersShot, setLeftThreePointersShot] = useState(0)

  const [centerTwoPointersMade, setCenterTwoPointersMade] = useState(0)
  const [centerTwoPointersShot, setCenterTwoPointersShot] = useState(0)
  const [centerThreePointersMade, setCenterThreePointersMade] = useState(0)
  const [centerThreePointersShot, setCenterThreePointersShot] = useState(0)

  const [unknownTwoPointersMade, setUnknownTwoPointersMade] = useState()
  const [unknownTwoPointersShot, setUnknownTwoPointersShot] = useState()
  const [unknownThreePointersMade, setUnknownThreePointersMade] = useState()
  const [unknownThreePointersShot, setUnknownThreePointersShot] = useState()

  return (
    <div>
      <CreateBackground>
        <CreateContainersForElements>
          <CreateCourtElement>
            <CreateHeatMaps
              gender={selectedGender}
              season={selectedSeason}
              team={selectedTeam}
              opponent={selectedOpponent}
              rightTwoPointersMade={rightTwoPointersMade}
              setRightTwoPointersMade={setRightTwoPointersMade}
              rightTwoPointersShot={rightTwoPointersShot}
              setRightTwoPointersShot={setRightTwoPointersShot}
              rightThreePointersMade={rightThreePointersMade}
              setRightThreePointersMade={setRightThreePointersMade}
              rightThreePointersShot={rightThreePointersShot}
              setRightThreePointersShot={setRightThreePointersShot}
              centerTwoPointersMade={centerTwoPointersMade}
              setCenterTwoPointersMade={setCenterTwoPointersMade}
              centerTwoPointersShot={centerTwoPointersShot}
              setCenterTwoPointersShot={setCenterTwoPointersShot}
              centerThreePointersMade={centerThreePointersMade}
              setCenterThreePointersMade={setCenterThreePointersMade}
              centerThreePointersShot={centerThreePointersShot}
              setCenterThreePointersShot={setCenterThreePointersShot}
              leftTwoPointersMade={leftTwoPointersMade}
              setLeftTwoPointersMade={setLeftTwoPointersMade}
              leftTwoPointersShot={leftTwoPointersShot}
              setLeftTwoPointersShot={setLeftTwoPointersShot}
              leftThreePointersMade={leftThreePointersMade}
              setLeftThreePointersMade={setLeftThreePointersMade}
              leftThreePointersShot={leftThreePointersShot}
              setLeftThreePointersShot={setLeftThreePointersShot}
              
            />
          </CreateCourtElement>
          <CreateListElements
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
            seasonOptions={seasonOptions}
            setSeasonOptions={setSeasonOptions}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            teamOptions={teamOptions}
            setTeamOptions={setTeamOptions}
            selectedOpponent={selectedOpponent}
            setSelectedOpponent={setSelectedOpponent}
            opponentOptions={opponentOptions}
            setOpponentOptions={setOpponentOptions}
          />
        </CreateContainersForElements>
      </CreateBackground>
    </div>
  );
}

export default App
