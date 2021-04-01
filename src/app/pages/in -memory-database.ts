import{InMemoryDbService} from "angular-in-memory-web-api";
export class InMemoryDataBase implements InMemoryDbService{

    createDb(){
        const categories = [
            {id: 1, name:'Moradia', description:'Pagamentos de Conta da Casa'},
            {id: 2, name:'Saúde',   description:'Plano de Saúde e Remédio'},
            {id: 3, name:'Lazer',   description:'Cinema, parques,praia,etc'},
            {id: 4, name:'Moradia', description:'Recibimento de salário'},
            {id: 5, name:'Moradia', description:'Trabalhos como freelancer'}
        ];
        return{categories}
    }
}