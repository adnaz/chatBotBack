import fetch from "node-fetch";
export default {
    menusOfrestaurant: async (req, res) => {
      console.log(req.body.name)
      fetch('https://www.livreur24.ma/api/v1/chat/menusRestaurant?key=',{
        method:'POST',
        body:JSON.stringify({
            name:req.body.name
        }),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response=>response.json())
    .then(({data})=>{
        // console.log(data)
        return res.status(200).json({ success: true ,data});
    })
      
    }
}