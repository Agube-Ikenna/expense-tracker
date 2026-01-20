import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Target,
  Settings,
  Moon,
  Sun,
  Plus,
  Trash2,
  DollarSign,
  Camera,
  FileText,
  AlertCircle,
  Send,
  Zap,
} from "lucide-react";
import Tesseract from "tesseract.js";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#14b8a6",
  "#f97316",
  "#6366f1",
  "#14b8a6",
];

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem("monthlyIncome");
    return saved ? JSON.parse(saved) : {};
  });

  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : {};
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem("goals");
    return saved ? JSON.parse(saved) : [];
  });

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  
  // Feature 1: Advanced Budget Rules
  const [budgetTemplate, setBudgetTemplate] = useState("none"); // none, 70-20-10, smart
  const [budgetAlerts, setBudgetAlerts] = useState({
    50: false,
    75: false,
    90: true,
    100: true,
  });
  
  // Feature 2: Receipt OCR
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptImage, setReceiptImage] = useState(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [receipts, setReceipts] = useState(() => {
    const saved = localStorage.getItem("receipts");
    return saved ? JSON.parse(saved) : [];
  });

  // Feature 3: Multi-Currency Support
  const [baseCurrency, setBaseCurrency] = useState("EUR");
  const [expenseCurrency, setExpenseCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({
    EUR: 1,
    USD: 1.08,
    GBP: 0.86,
    JPY: 160.5,
    CHF: 0.94,
    CAD: 1.47,
    AUD: 1.62,
  });

  // Feature 4: Net Worth Tracking
  const [assets, setAssets] = useState(() => {
    const saved = localStorage.getItem("assets");
    return saved ? JSON.parse(saved) : [];
  });
  const [liabilities, setLiabilities] = useState(() => {
    const saved = localStorage.getItem("liabilities");
    return saved ? JSON.parse(saved) : [];
  });
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showLiabilityModal, setShowLiabilityModal] = useState(false);
  const [assetName, setAssetName] = useState("");
  const [assetAmount, setAssetAmount] = useState("");
  const [liabilityName, setLiabilityName] = useState("");
  const [liabilityAmount, setLiabilityAmount] = useState("");

  // Feature 5: AI Insights & Predictions
  const [insights, setInsights] = useState([]);
  const [showInsights, setShowInsights] = useState(false);

  // Feature 6: Advanced Reporting
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [reportPeriod, setReportPeriod] = useState("month"); // month, quarter, year, custom

  // Feature 7: Expense Splitting
  const [splits, setSplits] = useState(() => {
    const saved = localStorage.getItem("splits");
    return saved ? JSON.parse(saved) : [];
  });
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitExpenseId, setSplitExpenseId] = useState(null);
  const [splitPeople, setSplitPeople] = useState("");
  const [splitAmounts, setSplitAmounts] = useState({});

  // Feature 8: Tags & Projects
  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem("tags");
    return saved ? JSON.parse(saved) : [];
  });
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // Feature 9: Notifications & Reminders
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("reminders");
    return saved ? JSON.parse(saved) : [];
  });
  const [notifications, setNotifications] = useState([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderName, setReminderName] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderAmount, setReminderAmount] = useState("");

  // Feature 10: Date Range Comparisons
  const [compareMode, setCompareMode] = useState(false);
  const [comparePeriod1, setComparePeriod1] = useState("");
  const [comparePeriod2, setComparePeriod2] = useState("");

  // ChatGPT Integration
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openaiKey") || "");
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChatSetup, setShowChatSetup] = useState(!apiKey);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  const predefinedCategories = [
    "Rent",
    "Food",
    "Groceries",
    "Transport",
    "Bills",
    "Health",
    "School",
    "Subscriptions",
    "Entertainment",
    "Savings",
    "Other",
  ];

  // Save data
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("monthlyIncome", JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("receipts", JSON.stringify(receipts));
  }, [receipts]);

  useEffect(() => {
    localStorage.setItem("assets", JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem("liabilities", JSON.stringify(liabilities));
  }, [liabilities]);

  useEffect(() => {
    localStorage.setItem("splits", JSON.stringify(splits));
  }, [splits]);

  useEffect(() => {
    localStorage.setItem("tags", JSON.stringify(tags));
  }, [tags]);

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem("openaiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get current month
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  // Add income
  const addIncome = () => {
    if (!incomeAmount) return;
    const month = getCurrentMonth();
    setIncome({
      ...income,
      [month]: parseFloat(incomeAmount),
    });
    setIncomeAmount("");
    setShowIncomeModal(false);
  };

  // Add expense
  const addExpense = () => {
    if (!amount || !date) return;
    
    let finalCategory = category;
    if (useCustomCategory) {
      if (!customCategory.trim()) return;
      finalCategory = customCategory.trim();
    } else {
      if (!category) return;
      finalCategory = category;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category: finalCategory,
      date,
      notes,
      recurring: isRecurring,
      recurringFreq: isRecurring ? recurringFreq : null,
      createdAt: new Date().toISOString(),
    };

    setExpenses([...expenses, newExpense]);

    // If recurring, add next month's expense
    if (isRecurring) {
      const nextDate = new Date(date);
      nextDate.setMonth(
        nextDate.getMonth() + (recurringFreq === "monthly" ? 1 : 0)
      );
      const nextExpense = {
        ...newExpense,
        id: Date.now() + 1,
        date: nextDate.toISOString().split("T")[0],
      };
      setExpenses((prev) => [...prev, nextExpense]);
    }

    setAmount("");
    setCategory("");
    setCustomCategory("");
    setDate("");
    setNotes("");
    setIsRecurring(false);
    setUseCustomCategory(false);
  };

  // Delete expense
  const deleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Add budget
  const addBudget = () => {
    if (!budgetCategory || !budgetAmount) return;
    setBudgets({
      ...budgets,
      [budgetCategory]: parseFloat(budgetAmount),
    });
    setBudgetCategory("");
    setBudgetAmount("");
    setShowBudgetModal(false);
  };

  // Add goal
  const addGoal = () => {
    if (!goalName || !goalAmount) return;
    setGoals([
      ...goals,
      {
        id: Date.now(),
        name: goalName,
        target: parseFloat(goalAmount),
        current: 0,
      },
    ]);
    setGoalName("");
    setGoalAmount("");
    setShowGoalModal(false);
  };

  // Feature 1: Apply Budget Template (70-20-10)
  const applyBudgetTemplate = (template) => {
    if (template === "70-20-10" && currentMonthIncome > 0) {
      const newBudgets = {
        "Rent": currentMonthIncome * 0.35,
        "Food": currentMonthIncome * 0.15,
        "Groceries": currentMonthIncome * 0.10,
        "Transport": currentMonthIncome * 0.10,
        "Bills": currentMonthIncome * 0.12,
        "Entertainment": currentMonthIncome * 0.08,
        "Health": currentMonthIncome * 0.05,
        "Subscriptions": currentMonthIncome * 0.05,
      };
      setBudgets(newBudgets);
      setBudgetTemplate("70-20-10");
      alert("✅ Budget template applied! 70% essentials, 20% wants, 10% savings");
    }
  };

  // Feature 1: Smart Budget Recommendations
  const getSmartBudgetRecommendations = () => {
    if (expenses.length < 3) return null;
    const avgByCategory = {};
    expenses.forEach((e) => {
      avgByCategory[e.category] = (avgByCategory[e.category] || 0) + e.amount;
    });
    
    return Object.entries(avgByCategory).map(([cat, total]) => ({
      category: cat,
      recommended: (total / Math.max(trendData.length, 1)) * 1.2, // +20% buffer
      current: budgets[cat] || 0,
    }));
  };

  // Feature 2: Handle Receipt Image Upload
  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target?.result);
    };
    reader.readAsDataURL(file);
  };

  // Feature 2: Extract Text from Receipt Image using OCR
  const extractReceiptData = async () => {
    if (!receiptImage) return;
    setOcrLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(
        receiptImage,
        "eng",
        { logger: (m) => console.log(m) }
      );

      // Simple parsing - extract numbers (amounts)
      const numberRegex = /\d+[.,]\d{2}/g;
      const amounts = text.match(numberRegex) || [];
      
      // Extract merchant/store name (usually first meaningful line)
      const lines = text.split("\n").filter((l) => l.trim().length > 3);
      const storeName = lines[0] || "Receipt";

      setOcrResult({
        text,
        amounts,
        storeName: storeName.substring(0, 30),
        amounts: amounts.map((a) => parseFloat(a.replace(",", "."))),
      });
    } catch (err) {
      alert("OCR Error: " + err.message);
    }
    setOcrLoading(false);
  };

  // Feature 2: Add Receipt Expense
  const addReceiptExpense = (amount, storeName) => {
    if (!amount || !date) return;

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      category: "Groceries",
      date,
      notes: `Receipt: ${storeName}`,
      recurring: false,
      recurringFreq: null,
      createdAt: new Date().toISOString(),
      receiptImage: receiptImage,
    };

    setExpenses([...expenses, newExpense]);
    setReceipts([
      ...receipts,
      {
        id: Date.now(),
        image: receiptImage,
        amount,
        storeName,
        date,
        expenseId: newExpense.id,
      },
    ]);

    setReceiptImage(null);
    setOcrResult(null);
    setShowReceiptModal(false);
  };

  // Feature 3: Convert Currency
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const amountInEur = amount / exchangeRates[fromCurrency];
    return amountInEur * exchangeRates[toCurrency];
  };

  // Feature 3: Get total expenses in base currency
  const getTotalInBaseCurrency = () => {
    return expenses.reduce((sum, e) => {
      const converted = convertCurrency(e.amount, expenseCurrency, baseCurrency);
      return sum + converted;
    }, 0);
  };

  // Feature 4: Calculate Net Worth
  const totalAssets = assets.reduce((sum, a) => sum + parseFloat(a.amount), 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + parseFloat(l.amount), 0);
  const netWorth = totalAssets - totalLiabilities;

  // Feature 4: Add Asset
  const addAsset = () => {
    if (!assetName || !assetAmount) return;
    setAssets([
      ...assets,
      {
        id: Date.now(),
        name: assetName,
        amount: parseFloat(assetAmount),
        createdAt: new Date().toISOString(),
      },
    ]);
    setAssetName("");
    setAssetAmount("");
    setShowAssetModal(false);
  };

  // Feature 4: Add Liability
  const addLiability = () => {
    if (!liabilityName || !liabilityAmount) return;
    setLiabilities([
      ...liabilities,
      {
        id: Date.now(),
        name: liabilityName,
        amount: parseFloat(liabilityAmount),
        createdAt: new Date().toISOString(),
      },
    ]);
    setLiabilityName("");
    setLiabilityAmount("");
    setShowLiabilityModal(false);
  };

  // Feature 4: Delete Asset
  const deleteAsset = (id) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  // Feature 4: Delete Liability
  const deleteLiability = (id) => {
    setLiabilities(liabilities.filter((l) => l.id !== id));
  };

  // Feature 5: Generate AI Insights
  const generateInsights = () => {
    const newInsights = [];

    // Insight 1: Spending trend
    if (trendData.length > 1) {
      const lastMonth = trendData[trendData.length - 1].total;
      const prevMonth = trendData[trendData.length - 2].total;
      const change = ((lastMonth - prevMonth) / prevMonth) * 100;
      if (Math.abs(change) > 15) {
        newInsights.push({
          type: "trend",
          icon: change > 0 ? "📈" : "📉",
          title: change > 0 ? "Spending Increased" : "Spending Decreased",
          message: `Your spending ${change > 0 ? "increased" : "decreased"} by ${Math.abs(change).toFixed(1)}% this month.`,
          severity: change > 0 ? "warning" : "success",
        });
      }
    }

    // Insight 2: Top spending category
    if (Object.keys(categoryTotals).length > 0) {
      const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      const percentage = (topCat[1] / monthlyTotal) * 100;
      newInsights.push({
        type: "category",
        icon: "🎯",
        title: "Top Spending Category",
        message: `${topCat[0]} is ${percentage.toFixed(1)}% of your spending. Consider setting a tighter budget.`,
        severity: percentage > 30 ? "warning" : "info",
      });
    }

    // Insight 3: Predicted next month
    if (trendData.length >= 3) {
      const recent = trendData.slice(-3).map((d) => d.total);
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      newInsights.push({
        type: "prediction",
        icon: "🔮",
        title: "Predicted Next Month",
        message: `Based on your last 3 months, expect to spend approximately €${avg.toFixed(2)} next month.`,
        severity: "info",
      });
    }

    // Insight 4: Budget health
    const exceedingBudgets = budgetStatus.filter((b) => b.status === "exceeded");
    if (exceedingBudgets.length > 0) {
      newInsights.push({
        type: "budget",
        icon: "⚠️",
        title: "Budget Exceeded",
        message: `${exceedingBudgets.length} budget(s) exceeded: ${exceedingBudgets.map((b) => b.category).join(", ")}`,
        severity: "critical",
      });
    }

    // Insight 5: Anomaly detection
    const avgAmount = expenses.length > 0 ? expenses.reduce((a, b) => a + b.amount, 0) / expenses.length : 0;
    const highExpenses = expenses.filter((e) => e.amount > avgAmount * 2 && e.date.startsWith(displayMonth));
    if (highExpenses.length > 0) {
      newInsights.push({
        type: "anomaly",
        icon: "🚨",
        title: "Unusual Spending Detected",
        message: `Found ${highExpenses.length} unusually large transaction(s) this month. Review: ${highExpenses.map((e) => `${e.category}: €${e.amount}`).join(", ")}`,
        severity: "warning",
      });
    }

    // Insight 6: Savings opportunity
    const savingsRate = currentMonthIncome > 0 ? ((currentMonthIncome - monthlyTotal) / currentMonthIncome) * 100 : 0;
    if (savingsRate < 10 && currentMonthIncome > 0) {
      newInsights.push({
        type: "savings",
        icon: "💡",
        title: "Low Savings Rate",
        message: `You're saving only ${savingsRate.toFixed(1)}% of income. Try to reach 20% for financial security.`,
        severity: "warning",
      });
    }

    setInsights(newInsights);
    setShowInsights(true);
  };

  // Feature 6: Filter expenses by date range
  const getReportExpenses = () => {
    let filtered = expenses;
    if (reportStartDate) {
      filtered = filtered.filter((e) => e.date >= reportStartDate);
    }
    if (reportEndDate) {
      filtered = filtered.filter((e) => e.date <= reportEndDate);
    }
    return filtered;
  };

  // Feature 6: Generate PDF Report
  const generatePDFReport = () => {
    const reportExpenses = getReportExpenses();
    const categoryBreakdown = reportExpenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const total = reportExpenses.reduce((sum, e) => sum + e.amount, 0);
    const startDate = reportStartDate || "All Time";
    const endDate = reportEndDate || "Today";

    let content = `EXPENSE REPORT\n`;
    content += `Period: ${startDate} to ${endDate}\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    content += `SUMMARY\n`;
    content += `Total Expenses: €${total.toFixed(2)}\n`;
    content += `Number of Transactions: ${reportExpenses.length}\n\n`;
    content += `CATEGORY BREAKDOWN\n`;
    Object.entries(categoryBreakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, amount]) => {
        const pct = ((amount / total) * 100).toFixed(1);
        content += `${cat}: €${amount.toFixed(2)} (${pct}%)\n`;
      });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    alert("✅ Report exported!");
  };

  // Feature 7: Split Expense
  const splitExpense = () => {
    if (!splitPeople || splitPeople.split(",").length < 2) {
      alert("Enter at least 2 people names separated by commas");
      return;
    }
    const people = splitPeople.split(",").map((p) => p.trim());
    const splitAmount = monthlyTotal / people.length;
    setSplits([
      ...splits,
      {
        id: Date.now(),
        expenseId: splitExpenseId,
        people,
        amounts: Object.fromEntries(people.map((p) => [p, splitAmount])),
        createdAt: new Date().toISOString(),
      },
    ]);
    setSplitPeople("");
    setShowSplitModal(false);
    alert(`✅ Expense split among ${people.length} people: €${splitAmount.toFixed(2)} each`);
  };

  // Feature 7: Calculate who owes whom
  const getSettlements = () => {
    const balances = {};
    splits.forEach((split) => {
      split.people.forEach((person) => {
        balances[person] = (balances[person] || 0) - (split.amounts[person] || 0);
      });
    });
    return Object.entries(balances).filter(([, amount]) => Math.abs(amount) > 0.01);
  };

  // Feature 8: Add Project
  const addProject = () => {
    if (!projectName) return;
    setProjects([
      ...projects,
      {
        id: Date.now(),
        name: projectName,
        tags: selectedTags,
        createdAt: new Date().toISOString(),
      },
    ]);
    setProjectName("");
    setSelectedTags([]);
    setShowProjectModal(false);
  };

  // Feature 8: Add Tag to Expense
  const addTagToExpense = (expenseId, tag) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;
    if (!expense.tags) expense.tags = [];
    if (!expense.tags.includes(tag)) {
      expense.tags.push(tag);
      setExpenses([...expenses]);
    }
  };

  // Feature 9: Add Reminder
  const addReminder = () => {
    if (!reminderName || !reminderDate) return;
    setReminders([
      ...reminders,
      {
        id: Date.now(),
        name: reminderName,
        date: reminderDate,
        amount: reminderAmount,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setReminderName("");
    setReminderDate("");
    setReminderAmount("");
    alert("✅ Reminder added!");
  };

  // Feature 9: Check upcoming reminders
  const getUpcomingReminders = () => {
    const today = new Date();
    return reminders.filter((r) => {
      const reminderDate = new Date(r.date);
      const daysUntil = Math.ceil((reminderDate - today) / (1000 * 60 * 60 * 24));
      return daysUntil <= 7 && daysUntil >= 0 && !r.completed;
    });
  };

  // Feature 10: Compare two periods
  const getComparisonData = () => {
    if (!comparePeriod1 || !comparePeriod2) return null;

    const exp1 = expenses.filter((e) => e.date.startsWith(comparePeriod1));
    const exp2 = expenses.filter((e) => e.date.startsWith(comparePeriod2));

    const total1 = exp1.reduce((sum, e) => sum + e.amount, 0);
    const total2 = exp2.reduce((sum, e) => sum + e.amount, 0);
    const change = ((total2 - total1) / total1) * 100;

    return {
      period1: comparePeriod1,
      period2: comparePeriod2,
      total1,
      total2,
      change,
      expenseCount1: exp1.length,
      expenseCount2: exp2.length,
    };
  };

  // Feature 10: Get year-to-date total
  const getYearToDateTotal = () => {
    const currentYear = new Date().getFullYear();
    return expenses
      .filter((e) => e.date.startsWith(currentYear.toString()))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // ChatGPT Integration - Send Message
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !apiKey) return;

    const userMessage = { role: "user", content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      // Call OpenAI API via our backend (for security, use server-side in production)
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful financial advisor. The user's current financial data:
- Monthly Income: €${currentMonthIncome.toFixed(2)}
- This Month Spent: €${monthlyTotal.toFixed(2)}
- Remaining: €${remainingIncome.toFixed(2)}
- Total Expenses: ${expenses.length} transactions
- Total Assets: €${totalAssets.toFixed(2)}
- Total Liabilities: €${totalLiabilities.toFixed(2)}
- Net Worth: €${netWorth.toFixed(2)}
- Top Category: ${Object.keys(categoryTotals).length > 0 ? Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0][0] : 'N/A'}

Provide concise, actionable financial advice.`,
            },
            ...newMessages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiMessage = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setChatMessages([...newMessages, aiMessage]);
    } catch (err) {
      const errorMessage = {
        role: "assistant",
        content: `❌ Error: ${err.message}. Make sure your OpenAI API key is valid.`,
      };
      setChatMessages([...newMessages, errorMessage]);
    } finally {
      setChatLoading(false);
    }
  };

  // Filter expenses
  const months = Array.from(
    new Set(expenses.map((e) => e.date.slice(0, 7)))
  ).sort().reverse();

  const currentMonth = getCurrentMonth();
  const displayMonth = selectedMonth || currentMonth;

  const filteredExpenses = expenses
    .filter((e) => (!selectedMonth ? e.date.startsWith(currentMonth) : e.date.startsWith(selectedMonth)))
    .filter((e) =>
      searchText ? e.category.toLowerCase().includes(searchText.toLowerCase()) : true
    )
    .filter((e) =>
      filterAmount ? e.amount.toString().includes(filterAmount) : true
    );

  // Analytics
  const monthlyTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentMonthIncome = income[displayMonth] || 0;
  const remainingIncome = currentMonthIncome - monthlyTotal;

  const categoryTotals = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // Monthly trend
  const monthlyTrend = {};
  expenses.forEach((e) => {
    const month = e.date.slice(0, 7);
    monthlyTrend[month] = (monthlyTrend[month] || 0) + e.amount;
  });

  const trendData = Object.entries(monthlyTrend)
    .sort()
    .map(([month, total]) => ({
      month: new Date(month + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      total,
    }));

  // Budget tracking
  const budgetStatus = Object.entries(budgets).map(([cat, limit]) => {
    const spent = categoryTotals[cat] || 0;
    const percentage = (spent / limit) * 100;
    return {
      category: cat,
      limit,
      spent,
      percentage: Math.min(percentage, 100),
      status: spent > limit ? "exceeded" : spent / limit > 0.8 ? "warning" : "ok",
    };
  });

  // Export CSV
  const exportCSV = () => {
    const header = "Date,Category,Amount,Notes,Recurring\n";
    const rows = expenses
      .map((e) => `${e.date},${e.category},${e.amount},"${e.notes}",${e.recurring}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const exportJSON = () => {
    const data = {
      expenses,
      income,
      budgets,
      goals,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expense-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.expenses) setExpenses(data.expenses);
        if (data.income) setIncome(data.income);
        if (data.budgets) setBudgets(data.budgets);
        if (data.goals) setGoals(data.goals);
        alert("Data imported successfully!");
      } catch (err) {
        alert("Error importing file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const bgClass = darkMode
    ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    : "min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100";

  const textClass = darkMode ? "text-gray-300" : "text-gray-700";
  const cardBgClass = darkMode
    ? "bg-gradient-to-br from-slate-800 to-slate-800"
    : "bg-white";
  const inputBgClass = darkMode ? "bg-slate-700 text-white" : "bg-slate-100 text-gray-900";
  const timeLabel = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className={`${bgClass} p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              💰 Expense Tracker Pro
            </h1>
            <p className={`${textClass} text-lg`}>Complete financial management system</p>
            <p className={`${textClass} text-sm mt-1`}>Current time: {timeLabel}</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Income & Balance Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className={`border-green-500/20 ${cardBgClass}`}>
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">💵 Monthly Income</p>
              <p className="text-3xl font-bold text-green-400">
                €{currentMonthIncome.toFixed(2)}
              </p>
              <button
                onClick={() => setShowIncomeModal(true)}
                className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                {currentMonthIncome > 0 ? "Update" : "Add"} Income
              </button>
            </CardContent>
          </Card>

          <Card className={`border-red-500/20 ${cardBgClass}`}>
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">💸 Total Spent</p>
              <p className="text-3xl font-bold text-red-400">
                €{monthlyTotal.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {((monthlyTotal / currentMonthIncome) * 100).toFixed(1)}% of income
              </p>
            </CardContent>
          </Card>

          <Card
            className={`border-${
              remainingIncome >= 0 ? "emerald" : "orange"
            }-500/20 ${cardBgClass}`}
          >
            <CardContent className="p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">🏦 Remaining</p>
              <p
                className={`text-3xl font-bold ${
                  remainingIncome >= 0 ? "text-emerald-400" : "text-orange-400"
                }`}
              >
                €{remainingIncome.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {remainingIncome >= 0 ? "Unspent" : "Over budget"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Income Modal */}
        {showIncomeModal && (
          <Card className={`border-green-500/20 ${cardBgClass}`}>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                📊 Set Monthly Income
              </h3>
              <div className="space-y-2">
                <label className="text-sm text-gray-300">
                  Income for {displayMonth}
                </label>
                <input
                  type="number"
                  className={`border border-green-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                  placeholder="0.00"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addIncome} className="flex-1">
                  Save Income
                </Button>
                <Button
                  onClick={() => setShowIncomeModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className={`flex gap-2 border-b ${darkMode ? "border-gray-600" : "border-gray-300"} overflow-x-auto`}>
          {["expenses", "budgets", "goals", "analytics", "tools", "net-worth", "settings"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold capitalize transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : textClass
                }`}
              >
                {tab === "net-worth" ? "💰 Net Worth" : tab === "tools" ? "🛠️ Tools" : tab}
              </button>
            )
          )}
        </div>

        {/* Expenses Tab */}
        {activeTab === "expenses" && (
          <div className="space-y-6">
            {/* Feature 2: Receipt OCR Upload */}
            <Card className={`border-orange-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Camera size={24} /> Upload Receipt (OCR)
                </h3>
                <p className="text-sm text-gray-400">Take a photo or upload a receipt image to extract expense data</p>
                <label className="block">
                  <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                    <Camera size={20} /> Choose Receipt Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="hidden"
                  />
                </label>
                {receiptImage && (
                  <div className="space-y-4">
                    <img
                      src={receiptImage}
                      alt="Receipt preview"
                      className="w-full h-48 object-cover rounded-lg border border-orange-500/30"
                    />
                    <Button
                      onClick={extractReceiptData}
                      disabled={ocrLoading}
                      className="w-full"
                    >
                      {ocrLoading ? "🔄 Extracting..." : "🔍 Extract Data"}
                    </Button>
                  </div>
                )}
                {ocrResult && (
                  <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                    <p className="text-sm text-green-400">✅ Data Extracted:</p>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-300">
                        <span className="font-bold">Store:</span> {ocrResult.storeName}
                      </p>
                      <p className="text-xs text-gray-300">
                        <span className="font-bold">Amounts Found:</span> €{ocrResult.amounts.join(", €")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        className={`border border-orange-500/30 ${inputBgClass} p-2 flex-1 rounded-lg text-sm`}
                        defaultValue={ocrResult.amounts[ocrResult.amounts.length - 1] || ""}
                      >
                        <option value="">Select amount</option>
                        {ocrResult.amounts.map((amt) => (
                          <option key={amt} value={amt}>
                            €{amt.toFixed(2)}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={(e) => {
                          const selectedAmount = e.target.parentElement.querySelector("select").value;
                          addReceiptExpense(selectedAmount, ocrResult.storeName);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Input Card */}
            <Card className={`border-blue-500/20 ${cardBgClass}`}>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-2xl font-bold text-white mb-4">➕ Add New Expense</h2>
                
                {/* Feature 3: Currency Selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">
                    💱 Expense Currency
                  </label>
                  <select
                    className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                    value={expenseCurrency}
                    onChange={(e) => setExpenseCurrency(e.target.value)}
                  >
                    {Object.keys(exchangeRates).map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Amount (€)
                    </label>
                    <input
                      className={`border border-blue-500/30 ${inputBgClass} placeholder-gray-400 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Category
                    </label>
                    <div className="flex gap-2">
                      <select
                        disabled={useCustomCategory}
                        className={`border border-blue-500/30 ${inputBgClass} p-3 flex-1 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 disabled:opacity-50`}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="">Select category</option>
                        {predefinedCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          setUseCustomCategory(!useCustomCategory);
                          setCategory("");
                          setCustomCategory("");
                        }}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all"
                        title="Use custom category"
                      >
                        ✏️
                      </button>
                    </div>
                    {useCustomCategory && (
                      <input
                        type="text"
                        className={`border border-purple-500/30 ${inputBgClass} placeholder-gray-400 p-3 w-full rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
                        placeholder="Enter custom category (e.g., Haircut, Gym)"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Date
                    </label>
                    <input
                      className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-300">
                      Recurring
                    </label>
                    <div className="flex gap-2 mt-3">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                      {isRecurring && (
                        <select
                          className={`border border-blue-500/30 ${inputBgClass} p-2 rounded-lg text-sm flex-1`}
                          value={recurringFreq}
                          onChange={(e) => setRecurringFreq(e.target.value)}
                        >
                          <option value="monthly">Monthly</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-300">
                    Notes (Optional)
                  </label>
                  <textarea
                    className={`border border-blue-500/30 ${inputBgClass} placeholder-gray-400 p-3 w-full rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none`}
                    placeholder="Add notes about this expense..."
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <Button onClick={addExpense} className="w-full">
                  ✨ Add Expense
                </Button>
              </CardContent>
            </Card>

            {/* Filter & Search */}
            <Card className={`border-cyan-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-white">🔍 Search & Filter</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Filter by Month</label>
                    <select
                      className={`border border-cyan-500/30 ${inputBgClass} p-2 w-full rounded-lg text-sm`}
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <option value="">📅 Current Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Search Category</label>
                    <input
                      type="text"
                      className={`border border-cyan-500/30 ${inputBgClass} p-2 w-full rounded-lg text-sm`}
                      placeholder="e.g., Food"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Filter by Amount</label>
                    <input
                      type="text"
                      className={`border border-cyan-500/30 ${inputBgClass} p-2 w-full rounded-lg text-sm`}
                      placeholder="e.g., 50"
                      value={filterAmount}
                      onChange={(e) => setFilterAmount(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses List */}
            <Card className={`border-purple-500/20 ${cardBgClass}`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  📊 Transactions ({filteredExpenses.length})
                </h2>
                
                {/* Feature 7: Settlements Display */}
                {getSettlements().length > 0 && (
                  <div className="mb-4 bg-blue-900/30 p-3 rounded-lg border border-blue-500/30">
                    <p className="text-sm font-bold text-blue-300 mb-2">💳 Settlement Summary:</p>
                    {getSettlements().map(([person, amount]) => (
                      <p key={person} className="text-xs text-blue-200">
                        {amount > 0 ? "💸" : "💰"} {person}: {amount > 0 ? "owes" : "receives"} €{Math.abs(amount).toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}

                {filteredExpenses.length === 0 ? (
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-center py-6`}>
                    No expenses recorded yet
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredExpenses.map((e) => (
                      <div
                        key={e.id}
                        className={`flex justify-between items-center ${darkMode ? "bg-slate-700/50 hover:bg-slate-700/80" : "bg-slate-100"} p-4 rounded-lg transition-all duration-200 group`}
                      >
                        <div className="flex-1">
                          <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {e.category}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {e.date} {e.recurring && "🔄"}
                          </p>
                          {e.notes && (
                            <p className="text-gray-400 text-xs mt-1">{e.notes}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-green-400 font-bold text-lg">
                            €{e.amount.toFixed(2)}
                          </span>
                          <button
                            className="text-blue-400 hover:text-blue-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            onClick={() => {
                              setSplitExpenseId(e.id);
                              setShowSplitModal(true);
                            }}
                            title="Split this expense"
                          >
                            👥
                          </button>
                          <button
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            onClick={() => deleteExpense(e.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature 7: Split Modal */}
            {showSplitModal && (
              <Card className={`border-blue-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">👥 Split Expense</h3>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">People (comma-separated names)</label>
                    <input
                      type="text"
                      className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                      placeholder="Alice, Bob, Charlie"
                      value={splitPeople}
                      onChange={(e) => setSplitPeople(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={splitExpense} className="flex-1">
                      Split It
                    </Button>
                    <Button
                      onClick={() => {
                        setShowSplitModal(false);
                        setSplitPeople("");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === "budgets" && (
          <div className="space-y-6">
            {/* Feature 1: Budget Templates */}
            <Card className={`border-indigo-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">📋 Budget Templates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => applyBudgetTemplate("70-20-10")}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    📊 70-20-10 Rule
                  </Button>
                  <Button
                    onClick={() => {
                      const recs = getSmartBudgetRecommendations();
                      if (recs) {
                        setBudgets(
                          Object.fromEntries(
                            recs.map((r) => [r.category, r.recommended])
                          )
                        );
                        setBudgetTemplate("smart");
                        alert("✅ Smart budgets applied based on your spending!");
                      }
                    }}
                    variant="outline"
                  >
                    🤖 Smart Budgets
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Active Template: <span className="text-blue-400 font-bold">{budgetTemplate}</span>
                </p>
              </CardContent>
            </Card>

            {/* Feature 1: Budget Alert Thresholds */}
            <Card className={`border-yellow-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">🔔 Alert Thresholds</h3>
                <div className="space-y-2">
                  {[50, 75, 90, 100].map((threshold) => (
                    <div key={threshold} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={budgetAlerts[threshold]}
                        onChange={(e) =>
                          setBudgetAlerts({ ...budgetAlerts, [threshold]: e.target.checked })
                        }
                        className="w-4 h-4 rounded cursor-pointer"
                      />
                      <label className="text-sm text-gray-300">
                        Alert at {threshold}% budget used
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowBudgetModal(true)}
              className="flex items-center gap-2"
            >
              <Plus size={20} /> Add Budget
            </Button>

            {showBudgetModal && (
              <Card className={`border-blue-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">📊 Set Category Budget</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Category</label>
                      <select
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        value={budgetCategory}
                        onChange={(e) => setBudgetCategory(e.target.value)}
                      >
                        <option value="">Select category</option>
                        {predefinedCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Budget (€)</label>
                      <input
                        type="number"
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="0.00"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addBudget} className="flex-1">
                      Add Budget
                    </Button>
                    <Button
                      onClick={() => setShowBudgetModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Budget Status */}
            <div className="space-y-4">
              {budgetStatus.length > 0 ? (
                budgetStatus.map((budget) => (
                  <Card
                    key={budget.category}
                    className={`border-${
                      budget.status === "exceeded"
                        ? "red"
                        : budget.status === "warning"
                        ? "yellow"
                        : "green"
                    }-500/20 ${cardBgClass}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-white">{budget.category}</h3>
                        <span
                          className={`font-bold ${
                            budget.status === "exceeded"
                              ? "text-red-400"
                              : budget.status === "warning"
                              ? "text-yellow-400"
                              : "text-green-400"
                          }`}
                        >
                          €{budget.spent.toFixed(2)} / €{budget.limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            budget.status === "exceeded"
                              ? "bg-red-500"
                              : budget.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${budget.percentage}%` }}
                        />
                      </div>
                      {budget.status === "exceeded" && (
                        <p className="text-red-400 text-sm mt-2">
                          ⚠️ Over budget by €{(budget.spent - budget.limit).toFixed(2)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6">No budgets set yet</p>
              )}
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="space-y-6">
            <Button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-2"
            >
              <Target size={20} /> Add Goal
            </Button>

            {showGoalModal && (
              <Card className={`border-blue-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">🎯 Set Savings Goal</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Goal Name</label>
                      <input
                        type="text"
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="e.g., Vacation"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Target (€)</label>
                      <input
                        type="number"
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="0.00"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addGoal} className="flex-1">
                      Add Goal
                    </Button>
                    <Button
                      onClick={() => setShowGoalModal(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Goals Progress */}
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <Card key={goal.id} className={`border-emerald-500/20 ${cardBgClass}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-white">{goal.name}</h3>
                        <span className="text-emerald-400 font-bold">
                          €{goal.current.toFixed(2)} / €{goal.target.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                          style={{
                            width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-emerald-400 text-sm mt-2">
                        {Math.round((goal.current / goal.target) * 100)}% complete
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-6">No goals set yet</p>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Feature 5: AI Insights Button */}
            <Button
              onClick={generateInsights}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              🤖 Generate AI Insights
            </Button>

            {/* Feature 5: AI Insights Display */}
            {showInsights && insights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">✨ Smart Insights</h3>
                {insights.map((insight, idx) => (
                  <Card
                    key={idx}
                    className={`border-${
                      insight.severity === "critical"
                        ? "red"
                        : insight.severity === "warning"
                        ? "yellow"
                        : insight.severity === "success"
                        ? "green"
                        : "blue"
                    }-500/20 ${cardBgClass}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white">{insight.title}</p>
                          <p className="text-sm text-gray-300 mt-1">{insight.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <Card className={`border-blue-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Total Expenses</p>
                  <p className="text-3xl font-bold text-blue-400">
                    €{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-cyan-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">This Month</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    €{monthlyTotal.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-emerald-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Avg/Month</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    €
                    {(
                      expenses.reduce((sum, e) => sum + e.amount, 0) /
                      Math.max(trendData.length, 1)
                    ).toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-yellow-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Categories</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {Object.keys(categoryTotals).length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              {/* Pie Chart */}
              {pieData.length > 0 && (
                <Card className={`border-purple-500/20 ${cardBgClass}`}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      📈 Category Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Trend Chart */}
              {trendData.length > 0 && (
                <Card className={`border-orange-500/20 ${cardBgClass}`}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      📊 Spending Trend
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis stroke="#999" />
                        <YAxis stroke="#999" />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6", r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Category Breakdown */}
            <Card className={`border-emerald-500/20 ${cardBgClass}`}>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  🏷️ Category Breakdown
                </h2>
                {Object.entries(categoryTotals).length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No data</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(categoryTotals)
                      .sort((a, b) => b[1] - a[1])
                      .map(([cat, val]) => {
                        const percentage = monthlyTotal > 0 ? (val / monthlyTotal) * 100 : 0;
                        return (
                          <div key={cat}>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-300 font-medium">{cat}</span>
                              <span className="text-emerald-400 font-bold">
                                €{val.toFixed(2)}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tools Tab - Features 8, 9, 10 */}
        {activeTab === "tools" && (
          <div className="space-y-6">
            {/* ChatGPT Chat Interface */}
            {apiKey && (
              <Card className={`border-indigo-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Zap size={24} className="text-yellow-400" /> Financial AI Assistant
                  </h3>
                  
                  {/* Chat Messages */}
                  <div className={`h-96 overflow-y-auto space-y-3 p-4 rounded-lg ${darkMode ? "bg-slate-900/50" : "bg-slate-100"} border ${darkMode ? "border-slate-600" : "border-gray-300"}`}>
                    {chatMessages.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        💬 Start a conversation! Ask about budgeting, spending, or get financial advice...
                      </p>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.role === "user"
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-slate-700 text-gray-100 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask me about your finances..."
                      className={`border border-indigo-500/30 ${inputBgClass} p-3 flex-1 rounded-lg`}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !chatLoading) sendChatMessage();
                      }}
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={sendChatMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="flex items-center gap-2"
                    >
                      {chatLoading ? "..." : <Send size={18} />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestion if no API key */}
            {!apiKey && (
              <Card className={`border-yellow-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-lg font-bold text-yellow-400 mb-2">🤖 Enable ChatGPT Assistant</p>
                  <p className="text-gray-300 text-sm mb-4">Add your OpenAI API key in Settings to unlock AI-powered financial advice</p>
                  <Button onClick={() => setActiveTab("settings")} className="bg-yellow-600 hover:bg-yellow-700">
                    Go to Settings
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Feature 9: Upcoming Reminders */}
            {getUpcomingReminders().length > 0 && (
              <Card className={`border-orange-500/20 ${cardBgClass}`}>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    🔔 Upcoming Reminders
                  </h3>
                  <div className="space-y-2">
                    {getUpcomingReminders().map((r) => {
                      const daysUntil = Math.ceil(
                        (new Date(r.date) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div key={r.id} className="bg-orange-900/30 p-3 rounded-lg border border-orange-500/30">
                          <p className="font-bold text-orange-300">{r.name}</p>
                          <p className="text-xs text-orange-200">
                            {daysUntil === 0 ? "Today!" : `${daysUntil} days left`}
                          </p>
                          {r.amount && <p className="text-xs text-orange-200">Amount: €{r.amount}</p>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feature 9: Add Reminder */}
            <Card className={`border-blue-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">➕ Add Bill Reminder</h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Bill/Task Name</label>
                  <input
                    type="text"
                    className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                    placeholder="e.g., Electricity Bill, Insurance"
                    value={reminderName}
                    onChange={(e) => setReminderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Due Date</label>
                  <input
                    type="date"
                    className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Amount (Optional)</label>
                  <input
                    type="number"
                    className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                    placeholder="0.00"
                    value={reminderAmount}
                    onChange={(e) => setReminderAmount(e.target.value)}
                  />
                </div>
                <Button onClick={addReminder} className="w-full">
                  Add Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Feature 10: Period Comparison */}
            <Card className={`border-purple-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">📊 Compare Periods</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-300">Period 1 (YYYY-MM)</label>
                    <input
                      type="text"
                      className={`border border-purple-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                      placeholder="2026-01"
                      value={comparePeriod1}
                      onChange={(e) => setComparePeriod1(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-300">Period 2 (YYYY-MM)</label>
                    <input
                      type="text"
                      className={`border border-purple-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                      placeholder="2025-12"
                      value={comparePeriod2}
                      onChange={(e) => setComparePeriod2(e.target.value)}
                    />
                  </div>
                </div>
                {getComparisonData() && (
                  <div className="bg-purple-900/30 p-4 rounded-lg space-y-2 border border-purple-500/30">
                    <p className="font-bold text-purple-300">Comparison Results:</p>
                    <p className="text-sm text-purple-200">
                      {getComparisonData().period1}: €{getComparisonData().total1.toFixed(2)} ({getComparisonData().expenseCount1} transactions)
                    </p>
                    <p className="text-sm text-purple-200">
                      {getComparisonData().period2}: €{getComparisonData().total2.toFixed(2)} ({getComparisonData().expenseCount2} transactions)
                    </p>
                    <p className={`text-sm font-bold ${getComparisonData().change > 0 ? "text-red-400" : "text-green-400"}`}>
                      {getComparisonData().change > 0 ? "📈" : "📉"} Change: {getComparisonData().change.toFixed(1)}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feature 10: Year-to-Date Summary */}
            <Card className={`border-green-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400 text-sm mb-2">📅 Year-to-Date Total</p>
                <p className="text-4xl font-bold text-green-400">
                  €{getYearToDateTotal().toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {expenses.filter((e) => e.date.startsWith(new Date().getFullYear().toString())).length} transactions
                </p>
              </CardContent>
            </Card>

            {/* Feature 8: Projects */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">🎯 Projects</h2>
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} /> Add Project
                </Button>
              </div>

              {showProjectModal && (
                <Card className={`border-blue-500/20 ${cardBgClass}`}>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">➕ New Project</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Project Name</label>
                      <input
                        type="text"
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="e.g., Vacation Planning"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addProject} className="flex-1">
                        Create Project
                      </Button>
                      <Button
                        onClick={() => setShowProjectModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {projects.length > 0 ? (
                projects.map((proj) => (
                  <Card key={proj.id} className={`border-green-500/20 ${cardBgClass}`}>
                    <CardContent className="p-4">
                      <p className="font-semibold text-white">{proj.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Created {new Date(proj.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No projects yet</p>
              )}
            </div>
          </div>
        )}

        {/* Net Worth Tab - Feature 4 */}
        {activeTab === "net-worth" && (
          <div className="space-y-6">
            {/* Net Worth Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card className={`border-green-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">💰 Total Assets</p>
                  <p className="text-3xl font-bold text-green-400">
                    €{totalAssets.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-red-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">📉 Total Liabilities</p>
                  <p className="text-3xl font-bold text-red-400">
                    €{totalLiabilities.toFixed(2)}
                  </p>
                </CardContent>
              </Card>

              <Card className={`border-${netWorth >= 0 ? "emerald" : "orange"}-500/20 ${cardBgClass}`}>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">📊 Net Worth</p>
                  <p className={`text-3xl font-bold ${netWorth >= 0 ? "text-emerald-400" : "text-orange-400"}`}>
                    €{netWorth.toFixed(2)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Assets Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">💎 Assets</h2>
                <Button
                  onClick={() => setShowAssetModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} /> Add Asset
                </Button>
              </div>

              {showAssetModal && (
                <Card className={`border-green-500/20 ${cardBgClass}`}>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">➕ Add New Asset</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Asset Name</label>
                      <input
                        type="text"
                        className={`border border-green-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="e.g., Savings Account, Investment Portfolio"
                        value={assetName}
                        onChange={(e) => setAssetName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Amount (€)</label>
                      <input
                        type="number"
                        className={`border border-green-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="0.00"
                        value={assetAmount}
                        onChange={(e) => setAssetAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addAsset} className="flex-1">
                        Add Asset
                      </Button>
                      <Button
                        onClick={() => setShowAssetModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <Card key={asset.id} className={`border-green-500/20 ${cardBgClass}`}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white">{asset.name}</p>
                          <p className="text-xs text-gray-400">Added {new Date(asset.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-green-400 font-bold">€{asset.amount.toFixed(2)}</span>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteAsset(asset.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No assets yet</p>
                )}
              </div>
            </div>

            {/* Liabilities Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">📊 Liabilities</h2>
                <Button
                  onClick={() => setShowLiabilityModal(true)}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} /> Add Liability
                </Button>
              </div>

              {showLiabilityModal && (
                <Card className={`border-red-500/20 ${cardBgClass}`}>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white">➕ Add New Liability</h3>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Liability Name</label>
                      <input
                        type="text"
                        className={`border border-red-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="e.g., Car Loan, Credit Card Debt"
                        value={liabilityName}
                        onChange={(e) => setLiabilityName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Amount (€)</label>
                      <input
                        type="number"
                        className={`border border-red-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        placeholder="0.00"
                        value={liabilityAmount}
                        onChange={(e) => setLiabilityAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addLiability} className="flex-1">
                        Add Liability
                      </Button>
                      <Button
                        onClick={() => setShowLiabilityModal(false)}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {liabilities.length > 0 ? (
                  liabilities.map((liability) => (
                    <Card key={liability.id} className={`border-red-500/20 ${cardBgClass}`}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-white">{liability.name}</p>
                          <p className="text-xs text-gray-400">Added {new Date(liability.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-red-400 font-bold">€{liability.amount.toFixed(2)}</span>
                          <button
                            className="text-red-400 hover:text-red-300"
                            onClick={() => deleteLiability(liability.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No liabilities yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <Card className={`border-blue-500/20 ${cardBgClass}`}>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">💾 Data Management</h3>
                  <div className="space-y-3">
                    {/* Feature 6: Advanced Reporting */}
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-3">
                      <h4 className="font-bold text-white">📊 Advanced Reporting</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs text-gray-400">Start Date</label>
                          <input
                            type="date"
                            className={`border border-blue-500/30 ${inputBgClass} p-2 w-full rounded-lg text-sm`}
                            value={reportStartDate}
                            onChange={(e) => setReportStartDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400">End Date</label>
                          <input
                            type="date"
                            className={`border border-blue-500/30 ${inputBgClass} p-2 w-full rounded-lg text-sm`}
                            value={reportEndDate}
                            onChange={(e) => setReportEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <Button onClick={generatePDFReport} className="w-full flex items-center justify-center gap-2">
                        <FileText size={18} /> Generate Report
                      </Button>
                    </div>

                    <Button onClick={exportCSV} className="w-full flex items-center justify-center gap-2">
                      <Download size={20} /> Export as CSV
                    </Button>
                    <Button onClick={exportJSON} className="w-full flex items-center justify-center gap-2">
                      <Download size={20} /> Export as JSON (Backup)
                    </Button>
                    <label className="block">
                      <Button className="w-full flex items-center justify-center gap-2">
                        <Upload size={20} /> Import Data
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"} pt-6`}>
                  <h3 className="text-xl font-bold text-white mb-4">🤖 ChatGPT Assistant</h3>
                  {showChatSetup ? (
                    <div className="space-y-3 bg-slate-700/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-300 mb-3">
                        Get AI-powered financial advice from ChatGPT. You need an OpenAI API key.
                      </p>
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        📌 Get your API key from OpenAI
                      </a>
                      <input
                        type="password"
                        placeholder="Paste your OpenAI API key here (sk-...)"
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg text-sm`}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          if (apiKey) setShowChatSetup(false);
                        }}
                        className="w-full"
                      >
                        {apiKey ? "✅ Save API Key" : "Enter API Key First"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowChatSetup(true)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Zap size={18} /> Change API Key
                    </Button>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Ask: "What should I spend on?" "Analyze my expenses" "Budget tips"
                  </p>
                </div>

                <div className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"} pt-6`}>
                  <h3 className="text-xl font-bold text-white mb-4">⚙️ Display Settings</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-gray-300">Dark Mode</label>
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          darkMode ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            darkMode ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"} pt-6`}>
                  <h3 className="text-xl font-bold text-white mb-4">💱 Currency Settings</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300 block mb-2">Base Currency</label>
                      <select
                        className={`border border-blue-500/30 ${inputBgClass} p-3 w-full rounded-lg`}
                        value={baseCurrency}
                        onChange={(e) => setBaseCurrency(e.target.value)}
                      >
                        {Object.keys(exchangeRates).map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-gray-400">
                      Total expenses in {baseCurrency}: <span className="text-green-400 font-bold">{baseCurrency} {getTotalInBaseCurrency().toFixed(2)}</span>
                    </p>
                  </div>
                </div>

                <div className={`border-t ${darkMode ? "border-gray-600" : "border-gray-300"} pt-6`}>
                  <h3 className="text-xl font-bold text-white mb-4">ℹ️ Information</h3>
                  <p className="text-gray-400 text-sm">
                    Total Expenses: {expenses.length}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Active Budgets: {Object.keys(budgets).length}
                  </p>
                  <p className="text-gray-400 text-sm">Savings Goals: {goals.length}</p>
                  <p className="text-gray-400 text-sm mt-4">
                    Version: 2.1 (Pro Edition with Income & Custom Categories)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
