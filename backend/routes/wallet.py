from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from models.models import User, WalletTransaction

router = APIRouter()

class WithdrawRequest(BaseModel):
    user_id: int
    amount: float

@router.get("/{user_id}")
def get_wallet(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    transactions = db.query(WalletTransaction).filter(
        WalletTransaction.user_id == user_id
    ).order_by(WalletTransaction.created_at.desc()).limit(50).all()
    
    txn_list = [
        {
            "id": t.id,
            "amount": t.amount,
            "type": t.txn_type,
            "description": t.description,
            "date": t.created_at.strftime("%d %b %Y, %H:%M") if t.created_at else "N/A"
        }
        for t in transactions
    ]
    
    return {
        "balance": round(user.wallet_balance or 0, 2),
        "transactions": txn_list
    }

@router.post("/withdraw")
def withdraw(req: WithdrawRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    balance = user.wallet_balance or 0
    if req.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    if req.amount > balance:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")
    
    user.wallet_balance = round(balance - req.amount, 2)
    
    txn = WalletTransaction(
        user_id=req.user_id,
        amount=req.amount,
        txn_type="debit",
        description=f"Bank Transfer — ₹{req.amount:.0f} withdrawn to linked account"
    )
    db.add(txn)
    db.commit()
    
    return {
        "message": "Withdrawal successful",
        "new_balance": user.wallet_balance,
        "transaction_id": txn.id
    }
