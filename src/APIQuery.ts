export const getCardData = async (id: String) => {
    try {
        const response = await fetch("https://api.scryfall.com/cards/" + id, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        if (!response.ok) {
            throw new Error("HTTP ERROR")
        }
    
        const data = await response.json();
        return JSON.stringify(data)
    } catch (err) {
        alert(err)
        return ""
    }
}