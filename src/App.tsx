import { useState, useRef, useEffect, useMemo } from 'react'
import './App.scss'

const soundEffect = (fileName: string) => {
    const sound = new Audio(`/sound-effects/${fileName}.wav`);
    sound.play();
}

const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
}

const randomFromList = (list: any[]): any => {
  return list[random(0, list.length - 1)]
}

const fisherYates = (list: any[]): any[] => {
  let limit = list.length - 1;
  while(limit > 0) {
        let position = random(0, limit);

        let tmp = list[position];
        list[position] = list[limit];
        list[limit] = tmp;

        limit--;
  }

  return list;
}

const removeAccents = (string: string): string => {
  if (!string) return ''

  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const normalizeString = (string: string): string => {
  if (!string) return ''

  return removeAccents(string).toLowerCase().trim();
}

const levenshteinDistance = (a: string, b: string, corte = true): number => {
  if (!a || !b) return -1

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  a = normalizeString(a);
  b = normalizeString(b);

  if (corte) {
     if (a.length > b.length) {
      let diferenca = a.length - b.length;
      a = a.slice(0, a.length - diferenca);
     } else if (a.length < b.length) {
      let diferenca = b.length - a.length;
      b = b.slice(0, b.length - diferenca);
     }
  }

  let matrix = [];

  for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
         if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
         } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
         }
      }
  }

  return matrix[b.length][a.length];
}

const inList = (value: any, list: any[]): boolean => {
  for (let i = 0; i < list.length; i++) {
    if (value === list[i])
      return true
  }

  return false
}

const atLeastOneInList = (list1: any[], list2: any[]): boolean => {
  for (let i = 0; i < list1.length; i++) {
    for (let j = 0; j < list2.length; j++) {
      if (normalizeString(list1[i]) === normalizeString(list2[j])) {
        return true
      }
    }
  }

  return false
}

// atLeastOneInList(['Europa', 'Bandeira'], ['Mapa', 'Bandeira'])

const closestElement = (value: any, list: any[], ignore: any[] = []): any => {
  let closest = Number.POSITIVE_INFINITY
  let theOne
  for (let i = 0; i < list.length; i++) {
    if (!inList(list[i], ignore)) {
      let distance = levenshteinDistance(value, list[i])
      if (distance < closest) {
        closest = distance
        theOne = list[i]
      }
    }
  }

  return theOne
}

const getListFromObjectsAttr = (objects: any[], attr: string): any[] => {
  let list = []
  for (let i = 0; i < objects.length; i++) {
    list.push(objects[i][attr])
  }
  return list
}

const generateUniqueKey = () => {
  const alphabet = fisherYates(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '!', '@', '#', '$', '%', '&', '*', '-', '_', '+', '='])
  const date = new Date()
  let key = `${date.getTime()}`
  for (let i = 0; i < 12; i++) {
    key += randomFromList(alphabet)
  }

  return key
}

const copy = (element: any): any => {
  return JSON.parse(JSON.stringify(element))
}

let ds = [{"id":1,"question":"AC","answer":"Acre","categories":["Abreviação"],"selfSufficient":true},{"id":2,"question":"Rio Branco","answer":"Acre","categories":["Capital"],"selfSufficient":true},{"id":3,"question":"acriano","answer":"Acre","categories":["Gentílico"],"selfSufficient":true},{"id":4,"question":"brasil/hinos/Acre.mp3","answer":"Acre","categories":["Hino"],"selfSufficient":true},{"id":5,"question":"Área (km²): 164 123,964","answer":"Acre","categories":["Área"],"selfSufficient":true},{"id":6,"question":"Percentual territorial: 1,929","answer":"Acre","categories":["Percentual territorial"],"selfSufficient":true},{"id":7,"question":"País comparável: Suriname","answer":"Acre","categories":["País comparável"],"selfSufficient":true},{"id":8,"question":"brasil/bandeiras/Acre.png","answer":"Acre","categories":["Bandeira"],"selfSufficient":true},{"id":9,"question":"brasil/estados/Acre.png","answer":"Acre","categories":["Mapa"],"selfSufficient":true},{"id":10,"question":"brasil/brasoes/Acre.png","answer":"Acre","categories":["Brasão"],"selfSufficient":true},{"id":12,"question":"AL","answer":"Alagoas","categories":["Abreviação"],"selfSufficient":true},{"id":13,"question":"Maceió","answer":"Alagoas","categories":["Capital"],"selfSufficient":true},{"id":14,"question":"alagoano; alagoense","answer":"Alagoas","categories":["Gentílico"],"selfSufficient":true},{"id":15,"question":"brasil/hinos/Alagoas.mp3","answer":"Alagoas","categories":["Hino"],"selfSufficient":true},{"id":16,"question":"Área (km²): 27 843,295","answer":"Alagoas","categories":["Área"],"selfSufficient":true},{"id":17,"question":"Percentual territorial: 0,327","answer":"Alagoas","categories":["Percentual territorial"],"selfSufficient":true},{"id":18,"question":"País comparável: Haiti","answer":"Alagoas","categories":["País comparável"],"selfSufficient":true},{"id":19,"question":"brasil/bandeiras/Alagoas.png","answer":"Alagoas","categories":["Bandeira"],"selfSufficient":true},{"id":20,"question":"brasil/estados/Alagoas.png","answer":"Alagoas","categories":["Mapa"],"selfSufficient":true},{"id":21,"question":"brasil/brasoes/Alagoas.png","answer":"Alagoas","categories":["Brasão"],"selfSufficient":true},{"id":23,"question":"AP","answer":"Amapá","categories":["Abreviação"],"selfSufficient":true},{"id":24,"question":"Macapá","answer":"Amapá","categories":["Capital"],"selfSufficient":true},{"id":25,"question":"amapaense","answer":"Amapá","categories":["Gentílico"],"selfSufficient":true},{"id":26,"question":"brasil/hinos/Amapá.mp3","answer":"Amapá","categories":["Hino"],"selfSufficient":true},{"id":27,"question":"Área (km²): 142 470,762","answer":"Amapá","categories":["Área"],"selfSufficient":true},{"id":28,"question":"Percentual territorial: 1,674","answer":"Amapá","categories":["Percentual territorial"],"selfSufficient":true},{"id":29,"question":"País comparável: Tajiquistão","answer":"Amapá","categories":["País comparável"],"selfSufficient":true},{"id":30,"question":"brasil/bandeiras/Amapá.png","answer":"Amapá","categories":["Bandeira"],"selfSufficient":true},{"id":31,"question":"brasil/estados/Amapá.png","answer":"Amapá","categories":["Mapa"],"selfSufficient":true},{"id":32,"question":"brasil/brasoes/Amapá.png","answer":"Amapá","categories":["Brasão"],"selfSufficient":true},{"id":34,"question":"AM","answer":"Amazonas","categories":["Abreviação"],"selfSufficient":true},{"id":35,"question":"Manaus","answer":"Amazonas","categories":["Capital"],"selfSufficient":true},{"id":36,"question":"amazonense; baré","answer":"Amazonas","categories":["Gentílico"],"selfSufficient":true},{"id":37,"question":"brasil/hinos/Amazonas.mp3","answer":"Amazonas","categories":["Hino"],"selfSufficient":true},{"id":38,"question":"Área (km²): 1 559 167,889","answer":"Amazonas","categories":["Área"],"selfSufficient":true},{"id":39,"question":"Percentual territorial: 18,321","answer":"Amazonas","categories":["Percentual territorial"],"selfSufficient":true},{"id":40,"question":"País comparável: Mongólia","answer":"Amazonas","categories":["País comparável"],"selfSufficient":true},{"id":41,"question":"brasil/bandeiras/Amazonas.png","answer":"Amazonas","categories":["Bandeira"],"selfSufficient":true},{"id":42,"question":"brasil/estados/Amazonas.png","answer":"Amazonas","categories":["Mapa"],"selfSufficient":true},{"id":43,"question":"brasil/brasoes/Amazonas.png","answer":"Amazonas","categories":["Brasão"],"selfSufficient":true},{"id":45,"question":"BA","answer":"Bahia","categories":["Abreviação"],"selfSufficient":true},{"id":46,"question":"Salvador","answer":"Bahia","categories":["Capital"],"selfSufficient":true},{"id":47,"question":"baiano","answer":"Bahia","categories":["Gentílico"],"selfSufficient":true},{"id":48,"question":"brasil/hinos/Bahia.mp3","answer":"Bahia","categories":["Hino"],"selfSufficient":true},{"id":49,"question":"Área (km²): 564 760,427","answer":"Bahia","categories":["Área"],"selfSufficient":true},{"id":50,"question":"Percentual territorial: 6,636","answer":"Bahia","categories":["Percentual territorial"],"selfSufficient":true},{"id":51,"question":"País comparável: França","answer":"Bahia","categories":["País comparável"],"selfSufficient":true},{"id":52,"question":"brasil/bandeiras/Bahia.png","answer":"Bahia","categories":["Bandeira"],"selfSufficient":true},{"id":53,"question":"brasil/estados/Bahia.png","answer":"Bahia","categories":["Mapa"],"selfSufficient":true},{"id":54,"question":"brasil/brasoes/Bahia.png","answer":"Bahia","categories":["Brasão"],"selfSufficient":true},{"id":56,"question":"CE","answer":"Ceará","categories":["Abreviação"],"selfSufficient":true},{"id":57,"question":"Fortaleza","answer":"Ceará","categories":["Capital"],"selfSufficient":true},{"id":58,"question":"cearense","answer":"Ceará","categories":["Gentílico"],"selfSufficient":true},{"id":59,"question":"brasil/hinos/Ceará.mp3","answer":"Ceará","categories":["Hino"],"selfSufficient":true},{"id":60,"question":"Área (km²): 148 894,441","answer":"Ceará","categories":["Área"],"selfSufficient":true},{"id":61,"question":"Percentual territorial: 1,75","answer":"Ceará","categories":["Percentual territorial"],"selfSufficient":true},{"id":62,"question":"País comparável: Nepal","answer":"Ceará","categories":["País comparável"],"selfSufficient":true},{"id":63,"question":"brasil/bandeiras/Ceará.png","answer":"Ceará","categories":["Bandeira"],"selfSufficient":true},{"id":64,"question":"brasil/estados/Ceará.png","answer":"Ceará","categories":["Mapa"],"selfSufficient":true},{"id":65,"question":"brasil/brasoes/Ceará.png","answer":"Ceará","categories":["Brasão"],"selfSufficient":true},{"id":67,"question":"DF","answer":"Distrito Federal","categories":["Abreviação"],"selfSufficient":true},{"id":68,"question":"Brasília","answer":"Distrito Federal","categories":["Capital"],"selfSufficient":true},{"id":69,"question":"brasiliense; candango","answer":"Distrito Federal","categories":["Gentílico"],"selfSufficient":true},{"id":70,"question":"brasil/hinos/Distrito Federal.mp3","answer":"Distrito Federal","categories":["Hino"],"selfSufficient":true},{"id":71,"question":"Área (km²): 5 760,783","answer":"Distrito Federal","categories":["Área"],"selfSufficient":true},{"id":72,"question":"Percentual territorial: 0,068","answer":"Distrito Federal","categories":["Percentual territorial"],"selfSufficient":true},{"id":73,"question":"País comparável: Brunei","answer":"Distrito Federal","categories":["País comparável"],"selfSufficient":true},{"id":74,"question":"brasil/bandeiras/Distrito Federal.png","answer":"Distrito Federal","categories":["Bandeira"],"selfSufficient":true},{"id":75,"question":"brasil/estados/Distrito Federal.png","answer":"Distrito Federal","categories":["Mapa"],"selfSufficient":true},{"id":76,"question":"brasil/brasoes/Distrito Federal.png","answer":"Distrito Federal","categories":["Brasão"],"selfSufficient":true},{"id":78,"question":"ES","answer":"Espírito Santo","categories":["Abreviação"],"selfSufficient":true},{"id":79,"question":"Vitória","answer":"Espírito Santo","categories":["Capital"],"selfSufficient":true},{"id":80,"question":"capixaba; espírito-santense","answer":"Espírito Santo","categories":["Gentílico"],"selfSufficient":true},{"id":81,"question":"brasil/hinos/Espírito Santo.mp3","answer":"Espírito Santo","categories":["Hino"],"selfSufficient":true},{"id":82,"question":"Área (km²): 46 074,447","answer":"Espírito Santo","categories":["Área"],"selfSufficient":true},{"id":83,"question":"Percentual territorial: 0,541","answer":"Espírito Santo","categories":["Percentual territorial"],"selfSufficient":true},{"id":84,"question":"País comparável: Estônia","answer":"Espírito Santo","categories":["País comparável"],"selfSufficient":true},{"id":85,"question":"brasil/bandeiras/Espírito Santo.png","answer":"Espírito Santo","categories":["Bandeira"],"selfSufficient":true},{"id":86,"question":"brasil/estados/Espírito Santo.png","answer":"Espírito Santo","categories":["Mapa"],"selfSufficient":true},{"id":87,"question":"brasil/brasoes/Espírito Santo.png","answer":"Espírito Santo","categories":["Brasão"],"selfSufficient":true},{"id":89,"question":"GO","answer":"Goiás","categories":["Abreviação"],"selfSufficient":true},{"id":90,"question":"Goiânia","answer":"Goiás","categories":["Capital"],"selfSufficient":true},{"id":91,"question":"goiano","answer":"Goiás","categories":["Gentílico"],"selfSufficient":true},{"id":92,"question":"brasil/hinos/Goiás.mp3","answer":"Goiás","categories":["Hino"],"selfSufficient":true},{"id":93,"question":"Área (km²): 340 203,329","answer":"Goiás","categories":["Área"],"selfSufficient":true},{"id":94,"question":"Percentual territorial: 3,998","answer":"Goiás","categories":["Percentual territorial"],"selfSufficient":true},{"id":95,"question":"País comparável: Finlândia","answer":"Goiás","categories":["País comparável"],"selfSufficient":true},{"id":96,"question":"brasil/bandeiras/Goiás.png","answer":"Goiás","categories":["Bandeira"],"selfSufficient":true},{"id":97,"question":"brasil/estados/Goiás.png","answer":"Goiás","categories":["Mapa"],"selfSufficient":true},{"id":98,"question":"brasil/brasoes/Goiás.png","answer":"Goiás","categories":["Brasão"],"selfSufficient":true},{"id":100,"question":"MA","answer":"Maranhão","categories":["Abreviação"],"selfSufficient":true},{"id":101,"question":"São Luiz","answer":"Maranhão","categories":["Capital"],"selfSufficient":true},{"id":102,"question":"maranhense","answer":"Maranhão","categories":["Gentílico"],"selfSufficient":true},{"id":103,"question":"brasil/hinos/Maranhão.mp3","answer":"Maranhão","categories":["Hino"],"selfSufficient":true},{"id":104,"question":"Área (km²): 329 642,182","answer":"Maranhão","categories":["Área"],"selfSufficient":true},{"id":105,"question":"Percentual territorial: 3,873","answer":"Maranhão","categories":["Percentual territorial"],"selfSufficient":true},{"id":106,"question":"País comparável: Vietnã","answer":"Maranhão","categories":["País comparável"],"selfSufficient":true},{"id":107,"question":"brasil/bandeiras/Maranhão.png","answer":"Maranhão","categories":["Bandeira"],"selfSufficient":true},{"id":108,"question":"brasil/estados/Maranhão.png","answer":"Maranhão","categories":["Mapa"],"selfSufficient":true},{"id":109,"question":"brasil/brasoes/Maranhão.png","answer":"Maranhão","categories":["Brasão"],"selfSufficient":true},{"id":111,"question":"MT","answer":"Mato Grosso","categories":["Abreviação"],"selfSufficient":true},{"id":112,"question":"Cuiabá","answer":"Mato Grosso","categories":["Capital"],"selfSufficient":true},{"id":113,"question":"mato-grossense","answer":"Mato Grosso","categories":["Gentílico"],"selfSufficient":true},{"id":114,"question":"brasil/hinos/Mato Grosso.mp3","answer":"Mato Grosso","categories":["Hino"],"selfSufficient":true},{"id":115,"question":"Área (km²): 903 207,019","answer":"Mato Grosso","categories":["Área"],"selfSufficient":true},{"id":116,"question":"Percentual territorial: 10,613","answer":"Mato Grosso","categories":["Percentual territorial"],"selfSufficient":true},{"id":117,"question":"País comparável: Venezuela","answer":"Mato Grosso","categories":["País comparável"],"selfSufficient":true},{"id":118,"question":"brasil/bandeiras/Mato Grosso.png","answer":"Mato Grosso","categories":["Bandeira"],"selfSufficient":true},{"id":119,"question":"brasil/estados/Mato Grosso.png","answer":"Mato Grosso","categories":["Mapa"],"selfSufficient":true},{"id":120,"question":"brasil/brasoes/Mato Grosso.png","answer":"Mato Grosso","categories":["Brasão"],"selfSufficient":true},{"id":122,"question":"MS","answer":"Mato Grosso do Sul","categories":["Abreviação"],"selfSufficient":true},{"id":123,"question":"Campo Grande","answer":"Mato Grosso do Sul","categories":["Capital"],"selfSufficient":true},{"id":124,"question":"sul-mato-grossense; mato-grossense-do-sul","answer":"Mato Grosso do Sul","categories":["Gentílico"],"selfSufficient":true},{"id":125,"question":"brasil/hinos/Mato Grosso do Sul.mp3","answer":"Mato Grosso do Sul","categories":["Hino"],"selfSufficient":true},{"id":126,"question":"Área (km²): 357 145,534","answer":"Mato Grosso do Sul","categories":["Área"],"selfSufficient":true},{"id":127,"question":"Percentual territorial: 4,197","answer":"Mato Grosso do Sul","categories":["Percentual territorial"],"selfSufficient":true},{"id":128,"question":"País comparável: Alemanha","answer":"Mato Grosso do Sul","categories":["País comparável"],"selfSufficient":true},{"id":129,"question":"brasil/bandeiras/Mato Grosso do Sul.png","answer":"Mato Grosso do Sul","categories":["Bandeira"],"selfSufficient":true},{"id":130,"question":"brasil/estados/Mato Grosso do Sul.png","answer":"Mato Grosso do Sul","categories":["Mapa"],"selfSufficient":true},{"id":131,"question":"brasil/brasoes/Mato Grosso do Sul.png","answer":"Mato Grosso do Sul","categories":["Brasão"],"selfSufficient":true},{"id":133,"question":"MG","answer":"Minas Gerais","categories":["Abreviação"],"selfSufficient":true},{"id":134,"question":"Belo Horizonte","answer":"Minas Gerais","categories":["Capital"],"selfSufficient":true},{"id":135,"question":"mineiro","answer":"Minas Gerais","categories":["Gentílico"],"selfSufficient":true},{"id":136,"question":"brasil/hinos/Minas Gerais.mp3","answer":"Minas Gerais","categories":["Hino"],"selfSufficient":true},{"id":137,"question":"Área (km²): 586 521,123","answer":"Minas Gerais","categories":["Área"],"selfSufficient":true},{"id":138,"question":"Percentual territorial: 6,892","answer":"Minas Gerais","categories":["Percentual territorial"],"selfSufficient":true},{"id":139,"question":"País comparável: Madagascar","answer":"Minas Gerais","categories":["País comparável"],"selfSufficient":true},{"id":140,"question":"brasil/bandeiras/Minas Gerais.png","answer":"Minas Gerais","categories":["Bandeira"],"selfSufficient":true},{"id":141,"question":"brasil/estados/Minas Gerais.png","answer":"Minas Gerais","categories":["Mapa"],"selfSufficient":true},{"id":142,"question":"brasil/brasoes/Minas Gerais.png","answer":"Minas Gerais","categories":["Brasão"],"selfSufficient":true},{"id":144,"question":"PA","answer":"Pará","categories":["Abreviação"],"selfSufficient":true},{"id":145,"question":"Belém","answer":"Pará","categories":["Capital"],"selfSufficient":true},{"id":146,"question":"paraense","answer":"Pará","categories":["Gentílico"],"selfSufficient":true},{"id":147,"question":"brasil/hinos/Pará.mp3","answer":"Pará","categories":["Hino"],"selfSufficient":true},{"id":148,"question":"Área (km²): 1 245 870,798","answer":"Pará","categories":["Área"],"selfSufficient":true},{"id":149,"question":"Percentual territorial: 14,64","answer":"Pará","categories":["Percentual territorial"],"selfSufficient":true},{"id":150,"question":"País comparável: Angola","answer":"Pará","categories":["País comparável"],"selfSufficient":true},{"id":151,"question":"brasil/bandeiras/Pará.png","answer":"Pará","categories":["Bandeira"],"selfSufficient":true},{"id":152,"question":"brasil/estados/Pará.png","answer":"Pará","categories":["Mapa"],"selfSufficient":true},{"id":153,"question":"brasil/brasoes/Pará.png","answer":"Pará","categories":["Brasão"],"selfSufficient":true},{"id":155,"question":"PB","answer":"Paraíba","categories":["Abreviação"],"selfSufficient":true},{"id":156,"question":"João Pessoa","answer":"Paraíba","categories":["Capital"],"selfSufficient":true},{"id":157,"question":"paraibano","answer":"Paraíba","categories":["Gentílico"],"selfSufficient":true},{"id":158,"question":"brasil/hinos/Paraíba.mp3","answer":"Paraíba","categories":["Hino"],"selfSufficient":true},{"id":159,"question":"Área (km²): 56 467,242","answer":"Paraíba","categories":["Área"],"selfSufficient":true},{"id":160,"question":"Percentual territorial: 0,664","answer":"Paraíba","categories":["Percentual territorial"],"selfSufficient":true},{"id":161,"question":"País comparável: Croácia","answer":"Paraíba","categories":["País comparável"],"selfSufficient":true},{"id":162,"question":"brasil/bandeiras/Paraíba.png","answer":"Paraíba","categories":["Bandeira"],"selfSufficient":true},{"id":163,"question":"brasil/estados/Paraíba.png","answer":"Paraíba","categories":["Mapa"],"selfSufficient":true},{"id":164,"question":"brasil/brasoes/Paraíba.png","answer":"Paraíba","categories":["Brasão"],"selfSufficient":true},{"id":166,"question":"PR","answer":"Paraná","categories":["Abreviação"],"selfSufficient":true},{"id":167,"question":"Curitiba","answer":"Paraná","categories":["Capital"],"selfSufficient":true},{"id":168,"question":"paranaense","answer":"Paraná","categories":["Gentílico"],"selfSufficient":true},{"id":169,"question":"brasil/hinos/Paraná.mp3","answer":"Paraná","categories":["Hino"],"selfSufficient":true},{"id":170,"question":"Área (km²): 199 298,979","answer":"Paraná","categories":["Área"],"selfSufficient":true},{"id":171,"question":"Percentual territorial: 2,342","answer":"Paraná","categories":["Percentual territorial"],"selfSufficient":true},{"id":172,"question":"País comparável: Quirguistão","answer":"Paraná","categories":["País comparável"],"selfSufficient":true},{"id":173,"question":"brasil/bandeiras/Paraná.png","answer":"Paraná","categories":["Bandeira"],"selfSufficient":true},{"id":174,"question":"brasil/estados/Paraná.png","answer":"Paraná","categories":["Mapa"],"selfSufficient":true},{"id":175,"question":"brasil/brasoes/Paraná.png","answer":"Paraná","categories":["Brasão"],"selfSufficient":true},{"id":177,"question":"PE","answer":"Pernambuco","categories":["Abreviação"],"selfSufficient":true},{"id":178,"question":"Recife","answer":"Pernambuco","categories":["Capital"],"selfSufficient":true},{"id":179,"question":"pernambucano","answer":"Pernambuco","categories":["Gentílico"],"selfSufficient":true},{"id":180,"question":"brasil/hinos/Pernambuco.mp3","answer":"Pernambuco","categories":["Hino"],"selfSufficient":true},{"id":181,"question":"Área (km²): 98 067,881","answer":"Pernambuco","categories":["Área"],"selfSufficient":true},{"id":182,"question":"Percentual territorial: 1,152","answer":"Pernambuco","categories":["Percentual territorial"],"selfSufficient":true},{"id":183,"question":"País comparável: Coreia do Sul","answer":"Pernambuco","categories":["País comparável"],"selfSufficient":true},{"id":184,"question":"brasil/bandeiras/Pernambuco.png","answer":"Pernambuco","categories":["Bandeira"],"selfSufficient":true},{"id":185,"question":"brasil/estados/Pernambuco.png","answer":"Pernambuco","categories":["Mapa"],"selfSufficient":true},{"id":186,"question":"brasil/brasoes/Pernambuco.png","answer":"Pernambuco","categories":["Brasão"],"selfSufficient":true},{"id":188,"question":"PI","answer":"Piauí","categories":["Abreviação"],"selfSufficient":true},{"id":189,"question":"Terezina","answer":"Piauí","categories":["Capital"],"selfSufficient":true},{"id":190,"question":"piauiense","answer":"Piauí","categories":["Gentílico"],"selfSufficient":true},{"id":191,"question":"brasil/hinos/Piauí.mp3","answer":"Piauí","categories":["Hino"],"selfSufficient":true},{"id":192,"question":"Área (km²): 251 756,515","answer":"Piauí","categories":["Área"],"selfSufficient":true},{"id":193,"question":"Percentual territorial: 2,958","answer":"Piauí","categories":["Percentual territorial"],"selfSufficient":true},{"id":194,"question":"País comparável: Guiné","answer":"Piauí","categories":["País comparável"],"selfSufficient":true},{"id":195,"question":"brasil/bandeiras/Piauí.png","answer":"Piauí","categories":["Bandeira"],"selfSufficient":true},{"id":196,"question":"brasil/estados/Piauí.png","answer":"Piauí","categories":["Mapa"],"selfSufficient":true},{"id":197,"question":"brasil/brasoes/Piauí.png","answer":"Piauí","categories":["Brasão"],"selfSufficient":true},{"id":199,"question":"RJ","answer":"Rio de Janeiro","categories":["Abreviação"],"selfSufficient":true},{"id":200,"question":"Rio de Janeiro","answer":"Rio de Janeiro","categories":["Capital"],"selfSufficient":true},{"id":201,"question":"fluminense","answer":"Rio de Janeiro","categories":["Gentílico"],"selfSufficient":true},{"id":202,"question":"brasil/hinos/Rio de Janeiro.mp3","answer":"Rio de Janeiro","categories":["Hino"],"selfSufficient":true},{"id":203,"question":"Área (km²): 43 750,427","answer":"Rio de Janeiro","categories":["Área"],"selfSufficient":true},{"id":204,"question":"Percentual territorial: 0,514","answer":"Rio de Janeiro","categories":["Percentual territorial"],"selfSufficient":true},{"id":205,"question":"País comparável: Dinamarca","answer":"Rio de Janeiro","categories":["País comparável"],"selfSufficient":true},{"id":206,"question":"brasil/bandeiras/Rio de Janeiro.png","answer":"Rio de Janeiro","categories":["Bandeira"],"selfSufficient":true},{"id":207,"question":"brasil/estados/Rio de Janeiro.png","answer":"Rio de Janeiro","categories":["Mapa"],"selfSufficient":true},{"id":208,"question":"brasil/brasoes/Rio de Janeiro.png","answer":"Rio de Janeiro","categories":["Brasão"],"selfSufficient":true},{"id":210,"question":"RN","answer":"Rio Grande do Norte","categories":["Abreviação"],"selfSufficient":true},{"id":211,"question":"Natal","answer":"Rio Grande do Norte","categories":["Capital"],"selfSufficient":true},{"id":212,"question":"potiguar; rio-grandense-do-norte; norte-rio-grandense","answer":"Rio Grande do Norte","categories":["Gentílico"],"selfSufficient":true},{"id":213,"question":"brasil/hinos/Rio Grande do Norte.mp3","answer":"Rio Grande do Norte","categories":["Hino"],"selfSufficient":true},{"id":214,"question":"Área (km²): 52 809,602","answer":"Rio Grande do Norte","categories":["Área"],"selfSufficient":true},{"id":215,"question":"Percentual territorial: 0,621","answer":"Rio Grande do Norte","categories":["Percentual territorial"],"selfSufficient":true},{"id":216,"question":"País comparável: Bósnia e Herzegovina","answer":"Rio Grande do Norte","categories":["País comparável"],"selfSufficient":true},{"id":217,"question":"brasil/bandeiras/Rio Grande do Norte.png","answer":"Rio Grande do Norte","categories":["Bandeira"],"selfSufficient":true},{"id":218,"question":"brasil/estados/Rio Grande do Norte.png","answer":"Rio Grande do Norte","categories":["Mapa"],"selfSufficient":true},{"id":219,"question":"brasil/brasoes/Rio Grande do Norte.png","answer":"Rio Grande do Norte","categories":["Brasão"],"selfSufficient":true},{"id":221,"question":"RS","answer":"Rio Grande do Sul","categories":["Abreviação"],"selfSufficient":true},{"id":222,"question":"Porto Alegre","answer":"Rio Grande do Sul","categories":["Capital"],"selfSufficient":true},{"id":223,"question":"gaúcho; rio-grandense-do-sul; sul-rio-grandense","answer":"Rio Grande do Sul","categories":["Gentílico"],"selfSufficient":true},{"id":224,"question":"brasil/hinos/Rio Grande do Sul.mp3","answer":"Rio Grande do Sul","categories":["Hino"],"selfSufficient":true},{"id":225,"question":"Área (km²): 281 707,156","answer":"Rio Grande do Sul","categories":["Área"],"selfSufficient":true},{"id":226,"question":"Percentual territorial: 3,31","answer":"Rio Grande do Sul","categories":["Percentual territorial"],"selfSufficient":true},{"id":227,"question":"País comparável: Equador","answer":"Rio Grande do Sul","categories":["País comparável"],"selfSufficient":true},{"id":228,"question":"brasil/bandeiras/Rio Grande do Sul.png","answer":"Rio Grande do Sul","categories":["Bandeira"],"selfSufficient":true},{"id":229,"question":"brasil/estados/Rio Grande do Sul.png","answer":"Rio Grande do Sul","categories":["Mapa"],"selfSufficient":true},{"id":230,"question":"brasil/brasoes/Rio Grande do Sul.png","answer":"Rio Grande do Sul","categories":["Brasão"],"selfSufficient":true},{"id":232,"question":"RO","answer":"Rondônia","categories":["Abreviação"],"selfSufficient":true},{"id":233,"question":"Porto Velho","answer":"Rondônia","categories":["Capital"],"selfSufficient":true},{"id":234,"question":"rondoniense; rondoniano","answer":"Rondônia","categories":["Gentílico"],"selfSufficient":true},{"id":235,"question":"brasil/hinos/Rondônia.mp3","answer":"Rondônia","categories":["Hino"],"selfSufficient":true},{"id":236,"question":"Área (km²): 237 765,24","answer":"Rondônia","categories":["Área"],"selfSufficient":true},{"id":237,"question":"Percentual territorial: 2,794","answer":"Rondônia","categories":["Percentual territorial"],"selfSufficient":true},{"id":238,"question":"País comparável: Laos","answer":"Rondônia","categories":["País comparável"],"selfSufficient":true},{"id":239,"question":"brasil/bandeiras/Rondônia.png","answer":"Rondônia","categories":["Bandeira"],"selfSufficient":true},{"id":240,"question":"brasil/estados/Rondônia.png","answer":"Rondônia","categories":["Mapa"],"selfSufficient":true},{"id":241,"question":"brasil/brasoes/Rondônia.png","answer":"Rondônia","categories":["Brasão"],"selfSufficient":true},{"id":243,"question":"RR","answer":"Roraima","categories":["Abreviação"],"selfSufficient":true},{"id":244,"question":"Boa Vista","answer":"Roraima","categories":["Capital"],"selfSufficient":true},{"id":245,"question":"roraimense","answer":"Roraima","categories":["Gentílico"],"selfSufficient":true},{"id":246,"question":"brasil/hinos/Roraima.mp3","answer":"Roraima","categories":["Hino"],"selfSufficient":true},{"id":247,"question":"Área (km²): 223 644,527","answer":"Roraima","categories":["Área"],"selfSufficient":true},{"id":248,"question":"Percentual territorial: 2,628","answer":"Roraima","categories":["Percentual territorial"],"selfSufficient":true},{"id":249,"question":"País comparável: Guiana","answer":"Roraima","categories":["País comparável"],"selfSufficient":true},{"id":250,"question":"brasil/bandeiras/Roraima.png","answer":"Roraima","categories":["Bandeira"],"selfSufficient":true},{"id":251,"question":"brasil/estados/Roraima.png","answer":"Roraima","categories":["Mapa"],"selfSufficient":true},{"id":252,"question":"brasil/brasoes/Roraima.png","answer":"Roraima","categories":["Brasão"],"selfSufficient":true},{"id":254,"question":"SC","answer":"Santa Catarina","categories":["Abreviação"],"selfSufficient":true},{"id":255,"question":"Florianópolis","answer":"Santa Catarina","categories":["Capital"],"selfSufficient":true},{"id":256,"question":"catarinense; barriga-verde","answer":"Santa Catarina","categories":["Gentílico"],"selfSufficient":true},{"id":257,"question":"brasil/hinos/Santa Catarina.mp3","answer":"Santa Catarina","categories":["Hino"],"selfSufficient":true},{"id":258,"question":"Área (km²): 95 730,684","answer":"Santa Catarina","categories":["Área"],"selfSufficient":true},{"id":259,"question":"Percentual territorial: 1,125","answer":"Santa Catarina","categories":["Percentual territorial"],"selfSufficient":true},{"id":260,"question":"País comparável: Portugal","answer":"Santa Catarina","categories":["País comparável"],"selfSufficient":true},{"id":261,"question":"brasil/bandeiras/Santa Catarina.png","answer":"Santa Catarina","categories":["Bandeira"],"selfSufficient":true},{"id":262,"question":"brasil/estados/Santa Catarina.png","answer":"Santa Catarina","categories":["Mapa"],"selfSufficient":true},{"id":263,"question":"brasil/brasoes/Santa Catarina.png","answer":"Santa Catarina","categories":["Brasão"],"selfSufficient":true},{"id":265,"question":"SP","answer":"São Paulo","categories":["Abreviação"],"selfSufficient":true},{"id":266,"question":"São Paulo","answer":"São Paulo","categories":["Capital"],"selfSufficient":true},{"id":267,"question":"paulista","answer":"São Paulo","categories":["Gentílico"],"selfSufficient":true},{"id":268,"question":"brasil/hinos/São Paulo.mp3","answer":"São Paulo","categories":["Hino"],"selfSufficient":true},{"id":269,"question":"Área (km²): 248 219,481","answer":"São Paulo","categories":["Área"],"selfSufficient":true},{"id":270,"question":"Percentual territorial: 2,917","answer":"São Paulo","categories":["Percentual territorial"],"selfSufficient":true},{"id":271,"question":"País comparável: Reino Unido","answer":"São Paulo","categories":["País comparável"],"selfSufficient":true},{"id":272,"question":"brasil/bandeiras/São Paulo.png","answer":"São Paulo","categories":["Bandeira"],"selfSufficient":true},{"id":273,"question":"brasil/estados/São Paulo.png","answer":"São Paulo","categories":["Mapa"],"selfSufficient":true},{"id":274,"question":"brasil/brasoes/São Paulo.png","answer":"São Paulo","categories":["Brasão"],"selfSufficient":true},{"id":276,"question":"SE","answer":"Sergipe","categories":["Abreviação"],"selfSufficient":true},{"id":277,"question":"Aracajú","answer":"Sergipe","categories":["Capital"],"selfSufficient":true},{"id":278,"question":"sergipano; sergipense","answer":"Sergipe","categories":["Gentílico"],"selfSufficient":true},{"id":279,"question":"brasil/hinos/Sergipe.mp3","answer":"Sergipe","categories":["Hino"],"selfSufficient":true},{"id":280,"question":"Área (km²): 21 925,424","answer":"Sergipe","categories":["Área"],"selfSufficient":true},{"id":281,"question":"Percentual territorial: 0,258","answer":"Sergipe","categories":["Percentual territorial"],"selfSufficient":true},{"id":282,"question":"País comparável: El Salvador","answer":"Sergipe","categories":["País comparável"],"selfSufficient":true},{"id":283,"question":"brasil/bandeiras/Sergipe.png","answer":"Sergipe","categories":["Bandeira"],"selfSufficient":true},{"id":284,"question":"brasil/estados/Sergipe.png","answer":"Sergipe","categories":["Mapa"],"selfSufficient":true},{"id":285,"question":"brasil/brasoes/Sergipe.png","answer":"Sergipe","categories":["Brasão"],"selfSufficient":true},{"id":287,"question":"TO","answer":"Tocantins","categories":["Abreviação"],"selfSufficient":true},{"id":288,"question":"Palmas","answer":"Tocantins","categories":["Capital"],"selfSufficient":true},{"id":289,"question":"tocantinense","answer":"Tocantins","categories":["Gentílico"],"selfSufficient":true},{"id":290,"question":"brasil/hinos/Tocantins.mp3","answer":"Tocantins","categories":["Hino"],"selfSufficient":true},{"id":291,"question":"Área (km²): 277 466,763","answer":"Tocantins","categories":["Área"],"selfSufficient":true},{"id":292,"question":"Percentual territorial: 3,26","answer":"Tocantins","categories":["Percentual territorial"],"selfSufficient":true},{"id":293,"question":"País comparável: Burkina Faso","answer":"Tocantins","categories":["País comparável"],"selfSufficient":true},{"id":294,"question":"brasil/bandeiras/Tocantins.png","answer":"Tocantins","categories":["Bandeira"],"selfSufficient":true},{"id":295,"question":"brasil/estados/Tocantins.png","answer":"Tocantins","categories":["Mapa"],"selfSufficient":true},{"id":296,"question":"brasil/brasoes/Tocantins.png","answer":"Tocantins","categories":["Brasão"],"selfSufficient":true}]

type QuestionType = {
  id: number
  question: string
  answer: string
  categories: string[]
  selfSufficient: boolean
}

type ConfigType = {
  timePerQuestion: number
  amountOfPossibleVariations: number
  amountOfSuggestions: number
  listOfCategories: string
}

function App() {
  // mantém um valor enquanto as dependências não são modificadas
  const shuffleDataset = useRef(0)

  const dataset = useMemo(() => {
    return fisherYates(ds)
  }, [shuffleDataset])

  const allPossibleAnswers = useMemo(() => {
    return getListFromObjectsAttr(dataset, 'answer')
  }, [])

  const [questions, setQuestions] = useState(fisherYates(dataset))
  const [result, setResult] = useState(false)
  const [wasGivenAnswer, setWasGivenAnswer] = useState(false)
  const [answer, setAnswer] = useState('')
  const [timerKey, setTimerKey] = useState(0)
  const [isInitialConfigOpened, setIsInitialConfigOpened] = useState(true)
  const [questionDate, setQuestionDate] = useState(new Date())
  const [currentConfig, setCurrentConfig] = useState({
    timePerQuestion: 30,
    amountOfPossibleVariations: 2,
    amountOfSuggestions: 3,
    listOfCategories: "Abreviação, Capital, Gentílico, Hino, Área, Percentual territorial, País comparável, Bandeira, Mapa, Brasão"
  })
  const askedQuestions = useRef<string[]>([])
  const currentQuestion = useRef<QuestionType>()
  const [playedMatches, setPlayedMatches] = useState(0)
  const [points, setPoints] = useState(0)
  const [performance, setPerformance] = useState(0)
  const [record, setRecord] = useState(0)

  const usedTips = useRef(0)

  const totalOfSelfSufficients = useMemo(() => {
    let total = 0
    let splittedListOfCategories = currentConfig.listOfCategories.split(',')
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].selfSufficient && atLeastOneInList(dataset[i].categories, splittedListOfCategories))
        total++
    }
    return total
  }, [currentConfig])

  useEffect(() => {
    let storedRecord = localStorage.getItem('record')
    if (!storedRecord) {
      setRecord(0)
    } else {
      setRecord(JSON.parse(storedRecord))
    }

    // let storedConfig = localStorage.getItem('config')
    // if (storedConfig) {
    //   setCurrentConfig(JSON.parse(storedConfig))
    // }
  }, [])

  useEffect(() => {
    if (points > record) {
      localStorage.setItem('record', points.toString())
      setRecord(points)
    }
  }, [points])

  const handleResetTime = () => {
    setTimerKey(timerKey + 1)
  }

  const handleMessageGivenResult = () => {
    if (!wasGivenAnswer) return

    if (result) {
      return 'You are correct!'
    } else {
      return `Oops! The answer was "${currentQuestion.current!.answer}"!`
    }
  }

  const calculatePerformance = (): number => {
    if (playedMatches === 0) return 0

    return Math.round((points / (playedMatches * 10)) * 100)
  }

  const handleNext = () => {
    if (wasGivenAnswer) {
      usedTips.current = 0
      setWasGivenAnswer(false)
      handleResetTime()
      setAnswer('')
      setQuestionDate(new Date())
      setPerformance(calculatePerformance())
    }
  }

  const handleUserAnswer = (answer: string) => {
    if (!currentQuestion.current) return

    setPlayedMatches(currentPlayedMatches => {
      return playedMatches + 1
    })

    askedQuestions.current.push(currentQuestion.current.question)

    setWasGivenAnswer(true)
    if (normalizeString(answer) === normalizeString(currentQuestion.current.answer)) {
      soundEffect('right')
      setResult(true)
      setPoints(currentPoints => {
        return currentPoints + 10 - usedTips.current
      })
    } else {
      soundEffect('wrong')
      setResult(false)
    }
  }

  const defineListOfQuestions = (): QuestionType[] => {
    let end = false, splittedListOfCategories = currentConfig.listOfCategories.split(',')
    let randomQuestion: QuestionType = questions[0]

    if (askedQuestions.current.length >= totalOfSelfSufficients)
      askedQuestions.current = []

    while(!end) {
      randomQuestion = randomFromList(questions)
      if (randomQuestion.selfSufficient && atLeastOneInList(randomQuestion.categories, splittedListOfCategories) && !inList(randomQuestion.question, askedQuestions.current))
        end = true
    }

    currentQuestion.current = randomQuestion

    let finalResult = []
    finalResult.push(randomQuestion)

    let inserted = 0
    for (let i = 0; i < dataset.length; i++) {
      if (randomQuestion.answer === dataset[i].answer && atLeastOneInList(dataset[i].categories, splittedListOfCategories) && dataset[i].id !== randomQuestion.id) {
        finalResult.push(dataset[i])
        inserted++
      }

      if (inserted >= currentConfig.amountOfPossibleVariations)
        break;
    }

    return finalResult
  }

  const handlePlay = (config: ConfigType) => {
    setCurrentConfig(config)
    // localStorage.setItem('config', JSON.stringify(config))
    setIsInitialConfigOpened(false)
    setQuestionDate(new Date())
  }
  
  const updateConfig = (changes: any) => {
    setCurrentConfig(prevCurrentConfig => ({ ...prevCurrentConfig, ...changes }))
  }

  return (
    <div className="container">
      {
        isInitialConfigOpened &&
        <InitialConfig
          onPlay={handlePlay}
          config={currentConfig}
          updateConfig={updateConfig}
        />
      }
      {
        !isInitialConfigOpened &&
        <>
          <Menu
            handleNext={handleNext}
            setIsInitialConfigOpened={setIsInitialConfigOpened}
            points={points}
            performance={performance}
            playedMatches={playedMatches}
            record={record}
          />

          {wasGivenAnswer &&
            <div className="resultMessage">
              {handleMessageGivenResult()}
            </div>
          }


          {!wasGivenAnswer &&
            <>
              <Timer
                initialDate={questionDate}
                limit={currentConfig.timePerQuestion}
                onTimeout={handleUserAnswer}
              />
              <Question
                defineListOfQuestions={defineListOfQuestions}
                usedTips={usedTips}
              />
              <UserInputs
                allPossibleAnswers={allPossibleAnswers}
                amountOfSuggestions={currentConfig.amountOfSuggestions}
                onAnswerSend={handleUserAnswer}
              />
            </>
          }
        </>
      }


    </div>
  )
}

type UserInputsProps = {
  allPossibleAnswers: string[]
  amountOfSuggestions: number,
  onAnswerSend: (answer: string) => void
}

function UserInputs({allPossibleAnswers, amountOfSuggestions, onAnswerSend}: UserInputsProps) {
  const [answer, setAnswer] = useState('')
  const suggestionsVisibility = useRef('none')

  const createSuggestions = () => {
    let suggestions = []
    let ignore = []

    for (let i = 0; i < amountOfSuggestions; i++) {
      // *ordenar as distâncias
      const currentSuggestion = closestElement(answer, allPossibleAnswers, ignore)
      suggestions.push(currentSuggestion)
      ignore.push(currentSuggestion)
    }

    suggestionsVisibility.current = 'flex'

    return suggestions
  } 

  const handleAnswerChange = (e: any) => {
    setAnswer(e.target.value)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setAnswer(suggestion)
  }

  const handleAnswerSend = () => {
    onAnswerSend(answer)
  }

  return (
    <>
      <div className="suggestions" style={{display: suggestionsVisibility.current}}>
        <Suggestions
          listOfSuggestions={createSuggestions()}
          onSuggestionSelect={handleSuggestionSelect} 
        />
      </div>
      <Answer
        onSend={handleAnswerSend}
        onChange={handleAnswerChange}
        answer={answer}
      />
    </>
  )
}

type InitialConfigProps = {
  onPlay: (config: ConfigType) => void
  updateConfig: (changes: any) => void
  config: ConfigType
}

function InitialConfig({onPlay, updateConfig, config}: InitialConfigProps) {
  return (
    <div className="initialConfig">
      <h1>Brasil Quiz</h1>
      <h2>Configuration</h2>
      <label htmlFor="timePerQuestion">Time per question (in seconds): </label>
      <input onChange={(e) => updateConfig({timePerQuestion: e.target.value})} type="number" id="timePerQuestion" defaultValue={config.timePerQuestion}/>
      <label htmlFor="amountOfPossibleVariations">Amount of possible variations: </label>
      <input onChange={(e) => updateConfig({amountOfPossibleVariations: e.target.value})} type="number" id="amountOfPossibleVariations" defaultValue={config.amountOfPossibleVariations}/>
      <label htmlFor="amountOfSuggestions">Amount of suggestions:</label>
      <input onChange={(e) => updateConfig({amountOfSuggestions: e.target.value})} type="number" id="amountOfSuggestions" defaultValue={config.amountOfSuggestions}/>
      <label htmlFor="includedCategories">Included categories: </label>
      <textarea onChange={(e) => updateConfig({listOfCategories: e.target.value})} style={{height: "100px"}} spellCheck="false" id="includedCategories" defaultValue={config.listOfCategories}></textarea>  

      <button onClick={ () => onPlay(config) }>Play</button>
    </div>
  )
}

type MenuProps = {
  handleNext: () => void
  setIsInitialConfigOpened: (isInitialConfigOpened: boolean) => void
  playedMatches: number
  points: number
  performance: number
  record: number
}

function Menu({handleNext, setIsInitialConfigOpened, playedMatches, points, performance, record}: MenuProps) {
  return (
    <div className="menu">
      <button onClick={ () => { setIsInitialConfigOpened(true) }}><i className="bi bi-gear"></i></button>
      <button>{playedMatches} <i className="bi bi-check-all"></i></button>
      <button>{points} <i className="bi bi-star"></i></button>
      <button>{performance} <i className="bi bi-percent"></i></button>
      <button>{record} <i className="bi bi-award"></i></button>
      <button onClick={ handleNext }><i className="bi bi-arrow-right"></i></button>
    </div>
  )
}

function Slider({elements, usedTips}: any) {
  const [activeElement, setActiveElement] = useState(0)
  const [activeBulletPoint, setActiveBulletPoint] = useState(0)

  const getActiveElement = () => {
    return elements[activeElement]
  }

  const updateActiveElement = (e: any) => {
    usedTips.current++
    let newIndex = parseInt(e.target.getAttribute('id'))
    setActiveElement(newIndex)
    setActiveBulletPoint(newIndex)
  }

  const getControls = () => {
    return elements.map((element: any, index: number) => {
      if (index === activeBulletPoint) {
        return <div key={index} id={index.toString()} onClick={updateActiveElement} style={{width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: '#fff', cursor: 'pointer', marginRight: '1rem'}}></div>
      } else {
        return <div key={index} id={index.toString()} onClick={updateActiveElement} style={{width: '1rem', height: '1rem', borderRadius: '50%', backgroundColor: '#555', cursor: 'pointer', marginRight: '1rem'}}></div>       
      }
    })
  }

  return (
    <div className="question">
      {getActiveElement()}
      <div className="controls" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem'}}>
        {elements.length > 1 ? getControls() : ''}
      </div>
    </div>
  )
}

type QuestionProps = {
  defineListOfQuestions: () => QuestionType[]
  usedTips: any
}

function Question({ defineListOfQuestions, usedTips }: QuestionProps) {
  const listOfQuestions = defineListOfQuestions()

  if (!listOfQuestions) return <div></div>

  const questionType = (currentQuestion: QuestionType) => {
    if (currentQuestion.question.search('jpg') !== -1 || currentQuestion.question.search('png') !== -1) {
      return <img key={generateUniqueKey()} src={currentQuestion.question}/>
    } else if (currentQuestion.question.search('mp3') !== -1 || currentQuestion.question.search('ogg') !== -1) {
      return (
        <audio key={generateUniqueKey()} controls={true}>
          <source src={currentQuestion.question} type="audio/ogg"/>
          <source src={currentQuestion.question} type="audio/ogg"/>
          Your browser doesn't support the audio tag.
        </audio>
      )
    } else {
      return <div className="textualQuestion" key={generateUniqueKey()}>{currentQuestion.question}</div>
    }
  }

  const createElements = () => {
    return listOfQuestions.map(currentQuestion => {
      return questionType(currentQuestion)
    })
  }

  return (
    <Slider elements={createElements()} usedTips={usedTips}/>
  )
}

type SuggestionsProps = {
  listOfSuggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
}

function Suggestions({listOfSuggestions, onSuggestionSelect}: SuggestionsProps) {
  return (
    <>
    {
      listOfSuggestions.map((suggestion, index) => {
        return <div key={index} onClick={ () => onSuggestionSelect(suggestion)}>{suggestion}</div>
      })
    }
    </>
  )
}

type AnswerProps = {
  onSend: () => void
  onChange: (e: any) => void
  answer: string
}

function Answer({onSend, onChange, answer}: AnswerProps) {
  return (
    <div className="answer">
      <input onChange = {onChange} value={answer} type="text" placeholder="Answer"/>
      <button onClick={ () => onSend() }><i className="bi bi-send"></i></button>
    </div>
  )
}

type TimerProps = {
  initialDate: Date
  limit: number,
  onTimeout: (answer: string) => void
}

function Timer({initialDate, limit, onTimeout}: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(limit)

  useEffect(() => {
    const interval = setInterval(() => {
      let now = new Date()
      let newRemainingTime = Math.ceil(limit - ((now.getTime() - initialDate.getTime()) / 1000))
      if (newRemainingTime <= 0) {
        onTimeout('')
        clearInterval(interval)
      } else {
        setRemainingTime(newRemainingTime)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [initialDate, remainingTime])

  return <div className="timer">{remainingTime} <i className="bi bi-hourglass-split"></i></div>
}

export default App