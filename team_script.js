// 엑셀 데이터 파싱을 위한 함수
function parseExcelData(data) {
    var parsedData = Papa.parse(data, { header: true, dynamicTyping: true });
    var formattedData = parsedData.data.filter(row => Object.values(row).some(cell => cell !== undefined));
    return formattedData;
  }
  


// 참가자 추가
function addParticipant() {
    var participantTable = document.getElementById('participants');
    var newRow = participantTable.insertRow();
    newRow.innerHTML = `
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
    `;
}

// 파일 업로드
function uploadFile() {
    var fileUpload = document.getElementById('fileInput');
    var file = fileUpload.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var data = e.target.result;
        var participants = parseExcelData(data);
        populateParticipants(participants);
    };
    reader.readAsText(file);
}

// 엑셀 데이터로 참가자 목록 채우기
function populateParticipants(participants) {
    var participantTable = document.getElementById('participants');
    participantTable.innerHTML = `
        <tr>
            <th>구분번호</th>
            <th>학과</th>
            <th>이름</th>
            <th>성별</th>
        </tr>
    `;
    participants.forEach(function (participant) {
        var newRow = participantTable.insertRow();
        newRow.innerHTML = `
            <td>${participant['구분번호']}</td>
            <td>${participant['학과']}</td>
            <td>${participant['이름']}</td>
            <td>${participant['성별']}</td>
        `;
    });
}



// 팀 구성하기
function composeTeams() {
    var teamSize = parseInt(document.getElementById('teamSize').value);
    var option = document.getElementById('option').value;
    var participants = getParticipantsFromTable();

    // 팀 구성 로직
    var teams = [];
    if (option === 'equal') {
        teams = composeTeamsEqual(participants, teamSize);
    } else if (option === 'unequal') {
        teams = composeTeamsUnequal(participants, teamSize);
    }

    // 결과 출력
    displayOutput(teams);
}

// 팀 구성 로직 (학과별로 고르게 섞기)
function composeTeamsEqual(participants, teamSize) {
    var shuffledParticipants = shuffleArray(participants);
    var teams = [];
    var index = 0;
    while (index < shuffledParticipants.length) {
        var team = shuffledParticipants.slice(index, index + teamSize);
        teams.push(team);
        index += teamSize;
    }
    return teams;
}

// 팀 구성 로직 (랜덤으로 섞기)
function composeTeamsUnequal(participants, teamSize) {
    var shuffledParticipants = shuffleArray(participants);
    var teams = [];
    var index = 0;
    while (index < shuffledParticipants.length) {
        var team = shuffledParticipants.slice(index, index + teamSize);
        teams.push(team);
        index += team.length;
    }
    return teams;
}

// 참가자 테이블에서 참가자 정보 가져오기
function getParticipantsFromTable() {
    var participantTable = document.getElementById('participants');
    var rows = participantTable.rows;
    var participants = [];
    for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var participant = {
            구분번호: row.cells[0].querySelector('input').value,
            학과: row.cells[1].querySelector('input').value,
            이름: row.cells[2].querySelector('input').value,
            성별: row.cells[3].querySelector('input').value,
        };
        participants.push(participant);
    }
    return participants;
}

// 결과 출력
function displayOutput(teams) {
    var output = document.getElementById('output');
    output.innerHTML = '';

    teams.forEach(function (team, index) {
        var table = document.createElement('table');
        var tableHeader = document.createElement('tr');
        var headerColumns = Object.keys(team[0]);
        headerColumns.forEach(function (column) {
            var th = document.createElement('th');
            th.textContent = column;
            tableHeader.appendChild(th);
        });
        table.appendChild(tableHeader);

        team.forEach(function (member) {
            var tableRow = document.createElement('tr');
            headerColumns.forEach(function (column) {
                var td = document.createElement('td');
                td.textContent = member[column];
                tableRow.appendChild(td);
            });
            table.appendChild(tableRow);
        });

        output.appendChild(table);
        if (index < teams.length - 1) {
            output.appendChild(document.createElement('hr'));
        }
    });
}

// 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
    var shuffledArray = array.slice();
    for (var i = shuffledArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffledArray[i];
        shuffledArray[i] = shuffledArray[j];
        shuffledArray[j] = temp;
    }
    return shuffledArray;
}
